'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWishlist } from '@/hooks/useSupabase'
import { useAuth } from '@/components/SupabaseAuthProvider'
import AuthGuard from '@/components/AuthGuard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import ProductCard from '@/components/ProductCard'
import { Heart, ArrowLeft, Trash2, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export default function WishlistPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { wishlistItems, loading, error, removeFromWishlist, getWishlistCount } = useWishlist()
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  const handleRemoveFromWishlist = async (productId: string) => {
    setRemovingItems(prev => new Set(prev).add(productId))
    try {
      await removeFromWishlist(productId)
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleAddToCart = (productId: string) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', productId)
  }

  const formatPrice = (price: string | number | null | undefined): string => {
    if (price === null || price === undefined) return '0 MDL'
    
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'MDL'
    }).format(numPrice).replace(',', '.')
  }

  if (!user) {
    return (
      <AuthGuard>
        <div>Loading...</div>
      </AuthGuard>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - скрыт на мобильной */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 transition-colors">
              Acasă
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Produse favorite</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 md:pb-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Produse favorite</h1>
                <p className="text-gray-600">
                  {loading ? 'Se încarcă...' : `${getWishlistCount()} produse salvate`}
                </p>
              </div>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Înapoi la produse</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && wishlistItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nu aveți produse favorite
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Adăugați produse la favorite pentru a le găsi mai ușor mai târziu
            </p>
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Explorați produsele</span>
            </Link>
          </div>
        )}

        {/* Wishlist Items */}
        {!loading && wishlistItems.length > 0 && (
          <div className="space-y-6">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-600" />
                <span className="font-medium text-gray-900">
                  {getWishlistCount()} produse
                </span>
              </div>
              <Link
                href="/products"
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                Adaugă mai multe
              </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {wishlistItems.map((item) => {
                if (!item.product) return null
                
                return (
                  <div key={item.id} className="relative group">
                    {/* Product Card - кликабельная */}
                    <div 
                      onClick={() => router.push(`/products/${item.product_id}`)}
                      className="cursor-pointer"
                    >
                      <ProductCard
                        id={item.product_id}
                        title={item.product.title}
                        price={item.product.retail_price}
                        originalPrice={item.product.compare_price}
                        image={item.product.image || '/placeholder-image.jpg'}
                        inStock={item.product.stock > 0}
                      />
                    </div>
                    
                    {/* Remove Button - поверх карточки */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFromWishlist(item.product_id)
                      }}
                      disabled={removingItems.has(item.product_id)}
                      className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {removingItems.has(item.product_id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Desktop Footer */}
            <div className="hidden md:block bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    {getWishlistCount()} produse în favorite
                  </span>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Continuă cumpărăturile</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer - скрыт на мобильной */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* MobileNav */}
      <MobileNav />
    </div>
  )
} 