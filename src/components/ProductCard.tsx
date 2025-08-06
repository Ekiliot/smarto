'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useSupabase'
import { useAuth } from '@/components/SupabaseAuthProvider'

interface ProductCardProps {
  id: string
  title: string
  price: string | number
  originalPrice?: string | number
  image: string
  inStock?: boolean
}

export default function ProductCard({
  id,
  title,
  price,
  originalPrice,
  image,
  inStock = true
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  
  const isWishlisted = isInWishlist(id)

  // Вспомогательная функция для обработки цен
  const formatPrice = (price: string | number | null | undefined): string => {
    if (price === null || price === undefined) return '0'
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return numPrice.toLocaleString('ro-RO')
  }

  const discount = originalPrice ? Math.round(((typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice) - (typeof price === 'string' ? parseFloat(price) : price)) / (typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice) * 100) : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!inStock) return
    
    setIsAddingToCart(true)
    try {
      await addToCart(id, 1)
      // Можно добавить уведомление об успехе
    } catch (error) {
      console.error('Error adding to cart:', error)
      // Можно добавить уведомление об ошибке
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <Link href={`/products/${id}`} className="block">
      <div 
        className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          {discount > 0 && (
            <div className="absolute top-3 left-3">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                -{discount}%
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={async (e) => {
              e.preventDefault()
              e.stopPropagation()
              
              if (!user) {
                // TODO: Redirect to login or show login modal
                return
              }
              
              setIsWishlistLoading(true)
              try {
                if (isWishlisted) {
                  await removeFromWishlist(id)
                } else {
                  await addToWishlist(id)
                }
              } catch (error) {
                console.error('Error toggling wishlist:', error)
              } finally {
                setIsWishlistLoading(false)
              }
            }}
            disabled={isWishlistLoading}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isWishlistLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            )}
          </button>

          {/* Quick Actions */}
          <div className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className="bg-white/90 text-gray-700 p-2 rounded-full hover:bg-white transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!inStock || isAddingToCart}
              className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 md:p-4">
          {/* Title */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 transition-colors text-sm md:text-base">
            {title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg font-bold text-gray-900">
              {formatPrice(price)} MDL
            </span>
            {originalPrice && (
              <span className="text-xs md:text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)} MDL
              </span>
            )}
          </div>

          {/* Add to Cart Button - Hidden on mobile, shown on desktop */}
          <button
            onClick={handleAddToCart}
            className={`w-full mt-3 py-2 px-4 rounded-lg font-medium transition-colors hidden md:block ${
              inStock && !isAddingToCart
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!inStock || isAddingToCart}
          >
            {isAddingToCart ? 'Se adaugă...' : inStock ? 'Adaugă în coș' : 'Stoc epuizat'}
          </button>
        </div>
      </div>
    </Link>
  )
} 