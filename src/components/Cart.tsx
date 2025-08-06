'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useShipping } from '@/hooks/useShipping'
import { useCartBundles, useBundleOffers } from '@/hooks/useSupabase'
import BundleOffer from '@/components/BundleOffer'
import CartBundleItem from '@/components/CartBundleItem'
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Package,
  CreditCard,
  ArrowRight,
  Truck,
  CheckCircle
} from 'lucide-react'
import { Product } from '@/types'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const router = useRouter()
  const { 
    cartItems, 
    loading, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice, 
    getCartCount 
  } = useCart()
  
  const { getAvailableMethods } = useShipping()
  const { cartBundleItems, loading: cartBundlesLoading } = useCartBundles()
  const { bundleOffers, loading: bundlesLoading } = useBundleOffers()
  
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  
  // Получаем данные один раз
  const cartCount = getCartCount()
  
  // Calculate total price including bundle items
  const totalPrice = useMemo(() => {
    const cartTotal = getTotalPrice()
    const bundleTotal = cartBundleItems.reduce((sum, item) => sum + item.discounted_price, 0)
    return cartTotal + bundleTotal
  }, [getTotalPrice, cartBundleItems])
  
  // Get available shipping methods
  const availableShippingMethods = getAvailableMethods(totalPrice)
  
  // Helper function to determine if a method is premium/luxury
  const isPremiumMethod = (methodName: string): boolean => {
    const premiumKeywords = ['express', 'premium', 'luxury', 'vip', 'fast', 'urgent']
    return premiumKeywords.some(keyword => 
      methodName.toLowerCase().includes(keyword)
    )
  }

  // Calculate free shipping progress
  const freeShippingProgress = useMemo(() => {
    // Find all methods that have free shipping threshold (not just currently free ones)
    const methodsWithThreshold = availableShippingMethods.filter(method => 
      method.method.free_shipping_threshold && method.method.free_shipping_threshold > 0
    )
    
    if (methodsWithThreshold.length === 0) {
      return null
    }
    
    // Sort methods by threshold (lowest to highest)
    const sortedMethods = methodsWithThreshold.sort((a, b) => 
      (a.method.free_shipping_threshold || 0) - (b.method.free_shipping_threshold || 0)
    )
    
    // Find the NEXT threshold we haven't reached yet
    const nextUnreachedMethod = sortedMethods.find(method => 
      totalPrice < (method.method.free_shipping_threshold || 0)
    )
    
    // Find the highest threshold we've already achieved
    const highestAchievedMethod = sortedMethods
      .filter(method => totalPrice >= (method.method.free_shipping_threshold || 0))
      .pop()
    
    const targetMethod = nextUnreachedMethod || highestAchievedMethod
    
    if (!targetMethod) {
      return null
    }
    
    const threshold = targetMethod.method.free_shipping_threshold || 0
    const isNextTarget = nextUnreachedMethod !== undefined
    
    if (totalPrice >= threshold) {
      // Already have free shipping for this method
      return {
        method: targetMethod.method,
        threshold,
        current: totalPrice,
        progress: 100,
        remaining: 0,
        isAchieved: true,
        isNextTarget: false
      }
    }
    
    // Calculate progress
    const progress = Math.min((totalPrice / threshold) * 100, 99.9)
    const remaining = threshold - totalPrice
    
    return {
      method: targetMethod.method,
      threshold,
      current: totalPrice,
      progress,
      remaining,
      isAchieved: false,
      isNextTarget
    }
  }, [availableShippingMethods, totalPrice])

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    setIsUpdating(cartItemId)
    try {
      await updateQuantity(cartItemId, newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRemoveItem = async (cartItemId: string) => {
    setIsUpdating(cartItemId)
    try {
      await removeFromCart(cartItemId)
    } catch (error) {
      console.error('Error removing item:', error)
    } finally {
      setIsUpdating(null)
    }
  }

  const formatPrice = (price: string | number | null | undefined): string => {
    if (price === null || price === undefined) return '0'
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return numPrice.toLocaleString('ro-RO')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Cart Panel - справа */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Coșul meu ({cartCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Bar with Animation */}
          <AnimatePresence mode="wait">
            {freeShippingProgress && !freeShippingProgress.isAchieved && (
              <motion.div
                key="progress-cart"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`mb-4 p-3 border rounded-lg relative overflow-hidden ${
                  isPremiumMethod(freeShippingProgress.method.name)
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                    : 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200'
                }`}>
                {/* Animated background */}
                <div className={`absolute inset-0 animate-pulse ${
                  isPremiumMethod(freeShippingProgress.method.name)
                    ? 'bg-gradient-to-r from-blue-100/10 to-indigo-100/10'
                    : 'bg-gradient-to-r from-orange-100/10 to-yellow-100/10'
                }`} />
                
                {/* Premium sparkles */}
                {isPremiumMethod(freeShippingProgress.method.name) && (
                  <div className="absolute inset-0">
                    <div className="absolute top-1 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
                    <div className="absolute top-2 left-1/2 w-1 h-1 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute top-1 left-3/4 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                  </div>
                )}
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shadow-sm relative overflow-hidden ${
                        isPremiumMethod(freeShippingProgress.method.name)
                          ? 'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600'
                          : 'bg-gradient-to-br from-orange-400 to-orange-600'
                      }`}>
                        <Truck className="w-3 h-3 text-white relative z-10" />
                        {/* Shimmer overlay on the background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                      </div>
                      <span className="text-xs font-semibold text-gray-900">
                        Livrare gratuită {freeShippingProgress.method.name}
                      </span>
                    </div>
                    <span className={`text-xs font-bold ${
                      isPremiumMethod(freeShippingProgress.method.name)
                        ? 'text-blue-600'
                        : 'text-orange-600'
                    }`}>
                      {freeShippingProgress.progress.toFixed(0)}%
                    </span>
                  </div>
                  
                  {/* Enhanced Compact Progress Bar */}
                  <div className="relative mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                          isPremiumMethod(freeShippingProgress.method.name)
                            ? 'bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600'
                            : 'bg-gradient-to-r from-orange-400 to-orange-600'
                        }`}
                        style={{ width: `${freeShippingProgress.progress}%` }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                      </div>
                    </div>
                    
                    {/* Animated indicator */}
                    <div 
                      className={`absolute top-0 w-3 h-3 rounded-full border-2 border-white shadow-md transform -translate-y-0.5 transition-all duration-1000 ease-out ${
                        isPremiumMethod(freeShippingProgress.method.name)
                          ? 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700'
                          : 'bg-gradient-to-br from-orange-500 to-orange-700'
                      }`}
                      style={{ left: `calc(${freeShippingProgress.progress}% - 6px)` }}
                    >
                      <div className={`w-full h-full rounded-full animate-ping ${
                        isPremiumMethod(freeShippingProgress.method.name)
                          ? 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700'
                          : 'bg-gradient-to-br from-orange-500 to-orange-700'
                      }`} />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-600">
                      Mai aveți nevoie de <span className={`font-bold ${
                        isPremiumMethod(freeShippingProgress.method.name)
                          ? 'text-blue-600'
                          : 'text-orange-600'
                      }`}>
                        {formatPrice(freeShippingProgress.remaining)} MDL
                      </span>
                    </p>
                    {freeShippingProgress.progress > 80 && (
                      <p className={`text-xs font-bold mt-1 animate-pulse ${
                        isPremiumMethod(freeShippingProgress.method.name)
                          ? 'text-blue-600'
                          : 'text-orange-600'
                      }`}>
                        🎉 Aproape acolo!
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Free Shipping Achieved Message with Animation */}
            {freeShippingProgress && freeShippingProgress.isAchieved && (
              <motion.div
                key="achieved-cart"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`mb-4 p-3 border rounded-lg relative overflow-hidden ${
                  isPremiumMethod(freeShippingProgress.method.name)
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                }`}>
                {/* Celebration dots */}
                <div className="absolute inset-0">
                  {isPremiumMethod(freeShippingProgress.method.name) ? (
                    // Premium sparkles
                    <>
                      <div className="absolute top-1 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="absolute top-2 left-1/2 w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                      <div className="absolute top-1 left-3/4 w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }} />
                    </>
                  ) : (
                    // Regular confetti
                    <>
                      <div className="absolute top-1 left-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="absolute top-2 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                      <div className="absolute top-1 left-3/4 w-1 h-1 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }} />
                    </>
                  )}
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm relative overflow-hidden ${
                      isPremiumMethod(freeShippingProgress.method.name)
                        ? 'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600'
                        : 'bg-gradient-to-br from-green-400 to-green-600'
                    }`}>
                      <CheckCircle className="w-3 h-3 text-white relative z-10" />
                      {/* Shimmer overlay on the background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                    </div>
                    <div className="text-center">
                      <span className={`text-xs font-bold ${
                        isPremiumMethod(freeShippingProgress.method.name)
                          ? 'text-blue-800'
                          : 'text-green-800'
                      }`}>
                        🎉 Livrare gratuită activată!
                      </span>
                      <p className={`text-xs ${
                        isPremiumMethod(freeShippingProgress.method.name)
                          ? 'text-blue-600'
                          : 'text-green-600'
                      }`}>
                        {freeShippingProgress.method.name}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Se încarcă coșul...</p>
              </div>
            ) : cartItems.length === 0 && cartBundleItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Coșul este gol</h3>
                <p className="text-gray-600 mb-6">Adăugați produse pentru a începe cumpărăturile</p>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Vezi produsele
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Regular Cart Items */}
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    {item.product.image && (
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        width={48}
                        height={48}
                        className="rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.title}</h3>
                      <p className="text-sm text-gray-600">{formatPrice(item.product.retail_price)} MDL</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={isUpdating === item.id || item.quantity <= 1}
                        className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={isUpdating === item.id}
                        className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatPrice((typeof item.product.retail_price === 'string' ? parseFloat(item.product.retail_price) : item.product.retail_price) * item.quantity)} MDL
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isUpdating === item.id}
                        className="text-red-600 hover:text-red-800 mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Cart Bundle Items */}
                {cartBundleItems.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Produse Bundle ({cartBundleItems.length})
                    </h3>
                    <div className="space-y-3">
                      {cartBundleItems.map((bundleItem) => (
                        <CartBundleItem
                          key={bundleItem.id}
                          bundleItem={bundleItem}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Bundle Offers */}
                {bundleOffers.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Oferte Bundle
                    </h3>
                    <div className="space-y-4">
                      {bundleOffers.slice(0, 2).map((bundleOffer) => (
                        <div key={bundleOffer.bundle.id} className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 relative overflow-hidden">
                          {/* Sparkles */}
                          <div className="absolute inset-0">
                            <div className="absolute top-1 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
                            <div className="absolute top-2 left-1/2 w-1 h-1 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                            <div className="absolute top-1 left-3/4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                          </div>
                          
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 via-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm relative overflow-hidden">
                                  <Package className="w-4 h-4 text-white relative z-10" />
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 text-sm">
                                    {bundleOffer.bundle.name}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {bundleOffer.bundle.discount_percentage}% reducere
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-purple-600">
                                  {formatPrice(bundleOffer.totalDiscountedPrice)}
                                </div>
                                <div className="text-xs text-gray-500 line-through">
                                  {formatPrice(bundleOffer.totalOriginalPrice)}
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => {
                                // Add bundle to cart
                                bundleOffer.products.forEach((product: Product) => {
                                  // This would need to be implemented in useCartBundles
                                  console.log('Adding bundle product:', product.id)
                                })
                              }}
                              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-2 rounded text-sm hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-1"
                            >
                              <ShoppingCart className="w-3 h-3" />
                              <span>Adaugă Bundle</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 || cartBundleItems.length > 0 ? (
            <div className="border-t border-gray-200 p-6">
              {/* Total */}
              <div className="flex justify-between items-center text-lg font-semibold mb-4">
                <span>Total:</span>
                <span>{formatPrice(totalPrice)} MDL</span>
              </div>
              {cartBundleItems.length > 0 && (
                <div className="text-sm text-green-600 mb-4">
                  Inclusiv {cartBundleItems.length} produse bundle cu reducere
                </div>
              )}
              
              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose()
                  router.push('/checkout')
                }}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Finalizează comanda</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}