'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import { useCartBundles } from '@/hooks/useSupabase'
import { 
  Package, 
  Plus, 
  ShoppingCart, 
  Tag,
  X,
  CheckCircle
} from 'lucide-react'
import { BundleOffer as BundleOfferType, Product } from '@/types'

interface BundleOfferProps {
  bundleOffer: BundleOfferType
  currentProductId?: string
  onClose?: () => void
}

export default function BundleOffer({ bundleOffer, currentProductId, onClose }: BundleOfferProps) {
  const { addToCart } = useCart()
  const { addBundleToCart } = useCartBundles()
  const [isAdding, setIsAdding] = useState(false)
  const [addedProducts, setAddedProducts] = useState<string[]>([])

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'MDL'
    }).format(price).replace(',', '.')
  }

  const handleAddBundleToCart = async () => {
    setIsAdding(true)
    try {
      // Add all bundle products to cart with discount
      for (const product of bundleOffer.products) {
        if (product.id !== currentProductId) { // Don't add current product again
          await addBundleToCart(
            bundleOffer.bundle.id,
            product.id,
            product.retail_price,
            bundleOffer.bundle.discount_percentage
          )
        }
      }
      setAddedProducts(bundleOffer.products.map(p => p.id))
    } catch (error) {
      console.error('Error adding bundle to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const isBundleAdded = addedProducts.length === bundleOffer.products.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 relative overflow-hidden"
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/20 to-transparent animate-pulse" />
      
      {/* Premium sparkles */}
      <div className="absolute inset-0">
        <div className="absolute top-2 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
        <div className="absolute top-4 left-1/3 w-1 h-1 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3 left-2/3 w-1 h-1 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-2 left-3/4 w-1 h-1 bg-indigo-500 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
              <Package className="w-6 h-6 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {bundleOffer.bundle.name}
              </h3>
              <p className="text-sm text-gray-600">
                {bundleOffer.bundle.description || 'Bundle special cu discount'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-800 bg-clip-text text-transparent">
              {bundleOffer.bundle.discount_percentage}% OFF
            </div>
            <div className="text-sm text-gray-500">
              Economisiți {formatPrice(bundleOffer.totalDiscount)}
            </div>
          </div>
        </div>

        {/* Bundle Products */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            Produse în Bundle:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bundleOffer.products.map((product) => (
              <div key={product.id} className="flex items-center justify-between bg-white/80 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{product.title}</div>
                    <div className="text-sm text-gray-500">
                      {formatPrice(product.retail_price)}
                    </div>
                  </div>
                </div>
                {addedProducts.includes(product.id) && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white/80 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Preț original:</div>
              <div className="text-lg font-semibold text-gray-900 line-through">
                {formatPrice(bundleOffer.totalOriginalPrice)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Preț cu discount:</div>
              <div className="text-2xl font-bold text-purple-600">
                {formatPrice(bundleOffer.totalDiscountedPrice)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Economisiți:</div>
              <div className="text-lg font-bold text-green-600">
                {formatPrice(bundleOffer.totalDiscount)}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          {isBundleAdded ? (
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-800 rounded-full">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Bundle adăugat în coș!</span>
            </div>
          ) : (
            <button
              onClick={handleAddBundleToCart}
              disabled={isAdding}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
            >
              {isAdding ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Se adaugă...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Adaugă Bundle în Coș</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Special offer badge */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
            <span className="text-lg">🎉</span>
            <span className="text-sm font-semibold">
              Ofertă specială! Adaugă toate produsele și economisește {bundleOffer.bundle.discount_percentage}%!
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 