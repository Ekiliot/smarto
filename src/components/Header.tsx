'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart, Search, User, Home, Smartphone, Zap, LogOut, Settings, Shield, Heart } from 'lucide-react'
import { useAuth } from './SupabaseAuthProvider'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useSupabase'
import Cart from './Cart'
import MobileNav from './MobileNav'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout, isLoading } = useAuth()
  const { getCartCount } = useCart()
  const { getWishlistCount } = useWishlist()
  
  // Получаем количество товаров в корзине и вишлисте
  const cartCount = getCartCount()
  const wishlistCount = getWishlistCount()

  const handleNavigation = (href: string) => {
    if (href !== pathname) {
      window.location.href = href
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsUserMenuOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Smarto</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleNavigation('/')} className="text-gray-700 hover:text-smarto-600 transition-colors">
              <Home className="w-4 h-4 inline mr-1" />
              Acasă
            </button>
            <button onClick={() => handleNavigation('/products')} className="text-gray-700 hover:text-smarto-600 transition-colors">
              <Smartphone className="w-4 h-4 inline mr-1" />
              Produse
            </button>
            <button onClick={() => handleNavigation('/about')} className="text-gray-700 hover:text-smarto-600 transition-colors">
              Despre noi
            </button>
            <button onClick={() => handleNavigation('/contact')} className="text-gray-700 hover:text-smarto-600 transition-colors">
              Contact
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-smarto-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link 
              href="/wishlist"
              className="p-2 text-gray-700 hover:text-red-600 transition-colors relative"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link 
              href="/cart"
              className="p-2 text-gray-700 hover:text-orange-600 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-smarto-600 transition-colors rounded-lg"
                >
                  <div className="w-8 h-8 bg-smarto-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-smarto-600" />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {user.role === 'admin' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </span>
                      )}
                    </div>
                    
                    <Link href="/account" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4 mr-2" />
                      Contul meu
                    </Link>
                    
                    {user.role === 'admin' && (
                      <Link href="/admin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings className="w-4 h-4 mr-2" />
                        Administrare
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Deconectare
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn-primary">
                Conectare
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-700 hover:text-smarto-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => {
                  setIsMenuOpen(false)
                  handleNavigation('/')
                }}
                className="text-gray-700 hover:text-smarto-600 transition-colors flex items-center text-left"
              >
                <Home className="w-4 h-4 mr-2" />
                Acasă
              </button>
              <button 
                onClick={() => {
                  setIsMenuOpen(false)
                  handleNavigation('/products')
                }}
                className="text-gray-700 hover:text-smarto-600 transition-colors flex items-center text-left"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Produse
              </button>
              <button 
                onClick={() => {
                  setIsMenuOpen(false)
                  handleNavigation('/about')
                }}
                className="text-gray-700 hover:text-smarto-600 transition-colors text-left"
              >
                Despre noi
              </button>
              <button 
                onClick={() => {
                  setIsMenuOpen(false)
                  handleNavigation('/contact')
                }}
                className="text-gray-700 hover:text-smarto-600 transition-colors text-left"
              >
                Contact
              </button>
            </nav>
            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-200">
              <button className="p-2 text-gray-700 hover:text-smarto-600 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <Link 
                href="/cart"
                className="p-2 text-gray-700 hover:text-orange-600 transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/account" className="p-2 text-gray-700 hover:text-smarto-600 transition-colors">
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Cart Component */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Mobile Navigation */}
      <MobileNav />
    </header>
  )
} 