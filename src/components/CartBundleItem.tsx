'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCartBundles } from '@/hooks/useSupabase'
import { 
  Package, 
  X, 
  Plus, 
  Minus,
  Tag
} from 'lucide-react'
import { CartBundleItem as CartBundleItemType } from '@/types'

interface CartBundleItemProps {
  bundleItem: CartBundleItemType
  productTitle?: string
  productImage?: string
}

export default function CartBundleItem({ bundleItem, productTitle, productImage }: CartBundleItemProps) {
  const { updateBundleQuantity, removeBundleFromCart } = useCartBundles()
  const [isUpdating, setIsUpdating] = useState(false)

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'MDL'
    }).format(price).replace(',', '.')
  }

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return
    
    setIsUpdating(true)
    try {
      await updateBundleQuantity(bundleItem.id, newQuantity)
    } catch (error) {
      console.error('Error updating bundle quantity:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemoveItem = async () => {
    setIsUpdating(true)
    try {
      await removeBundleFromCart(bundleItem.id)
    } catch (error) {
      console.error('Error removing bundle item:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 relative overflow-hidden"
    >
      {/* Sparkles */}
      <div className="absolute inset-0">
        <div className="absolute top-1 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
        <div className="absolute top-2 left-1/2 w-1 h-1 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1 left-3/4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 via-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm relative overflow-hidden">
              <Package className="w-5 h-5 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">
                {productTitle || 'Produs Bundle'}
              </div>
              <div className="text-sm text-purple-600 font-medium">
                Bundle cu reducere
              </div>
            </div>
          </div>
          <button
            onClick={handleRemoveItem}
            disabled={isUpdating}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleUpdateQuantity(bundleItem.quantity - 1)}
              disabled={isUpdating || bundleItem.quantity <= 1}
              className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center font-medium">{bundleItem.quantity}</span>
            <button
              onClick={() => handleUpdateQuantity(bundleItem.quantity + 1)}
              disabled={isUpdating}
              className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-purple-600">
              {formatPrice(bundleItem.discounted_price)}
            </div>
            <div className="text-sm text-gray-500 line-through">
              {formatPrice(bundleItem.original_price)}
            </div>
            <div className="text-xs text-green-600 font-medium">
              Economisiți {formatPrice(bundleItem.discount_amount)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 