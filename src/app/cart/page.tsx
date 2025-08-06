'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/components/SupabaseAuthProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  Truck,
  Package,
  AlertCircle,
  CheckCircle,
  Check,
  Square
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { cartItems, loading, error, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
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

  const handleCheckout = () => {
    if (!user) {
      router.push('/login')
      return
    }
    router.push('/checkout')
  }

  // Функции для управления выбором товаров
  const handleSelectItem = (productId: string) => {
    const newSelectedItems = new Set(selectedItems)
    if (newSelectedItems.has(productId)) {
      newSelectedItems.delete(productId)
    } else {
      newSelectedItems.add(productId)
    }
    setSelectedItems(newSelectedItems)
    setSelectAll(newSelectedItems.size === cartItems.length)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set())
      setSelectAll(false)
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.product.id)))
      setSelectAll(true)
    }
  }

  const getSelectedItemsTotal = () => {
    return cartItems
      .filter(item => selectedItems.has(item.product.id))
      .reduce((total, item) => total + (parseFloat(String(item.product.retail_price)) * item.quantity), 0)
  }

  const getSelectedItemsCount = () => {
    return cartItems.filter(item => selectedItems.has(item.product.id)).length
  }

  const getShippingCost = () => {
    return getSelectedItemsTotal() >= 220 ? 0 : 30
  }

  const getTotalWithShipping = () => {
    return getSelectedItemsTotal() + getShippingCost()
  }

  const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'MDL'
    }).format(numPrice).replace(',', '.')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="hidden md:block">
          <Header />
        </div>
        <main className="py-4 md:py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Se încarcă coșul...</p>
              </div>
            </div>
          </div>
        </main>
        <div className="hidden md:block">
          <Footer />
        </div>
        <MobileNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Hidden on mobile */}
      <div className="hidden md:block">
        <Header />
      </div>
      
      <main className="py-4 md:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                                  {/* Fixed Mobile Header */}
            {cartItems.length > 0 && (
              <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h1 className="text-lg font-bold text-gray-900">Coșul meu</h1>
                        <p className="text-xs text-gray-600">
                          {cartItems.length} produs{cartItems.length > 1 ? 'e' : ''} în coș
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {selectAll ? (
                        <Check className="w-4 h-4 text-orange-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-gray-700">
                        {selectAll ? 'Deselectează tot' : 'Selectează tot'}
                      </span>
                    </button>
                  </div>
                  
                  {/* Mobile Free Shipping Progress Bar */}
                  <div className="mt-3 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-3 h-3 text-green-600" />
                        <span className="text-xs font-medium text-gray-900">Livrare gratuită</span>
                      </div>
                      <span className="text-xs text-gray-600">
                        {getSelectedItemsTotal() >= 220 ? 'Gratuită' : `${formatPrice(220 - getSelectedItemsTotal())} rămase`}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((getSelectedItemsTotal() / 220) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0 MDL</span>
                      <span>220 MDL</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Header */}
            <div className="hidden md:block mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Coșul meu</h1>
                    <p className="text-gray-600">
                      {cartItems.length > 0 
                        ? `${cartItems.length} produs${cartItems.length > 1 ? 'e' : ''} în coș`
                        : 'Coșul este gol'
                      }
                    </p>
                  </div>
                </div>
                
                {/* Select All Button - Only show if there are items */}
                {cartItems.length > 0 && (
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {selectAll ? (
                      <Check className="w-4 h-4 text-orange-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-gray-700">
                      {selectAll ? 'Deselectează tot' : 'Selectează tot'}
                    </span>
                  </button>
                )}
              </div>
            </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800">Eroare la încărcarea coșului. Încercați din nou.</span>
              </div>
            </div>
          )}

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Coșul este gol</h2>
                <p className="text-gray-600 mb-6">
                  Nu aveți produse în coș. Explorați produsele noastre și adăugați ceva interesant!
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  <Package className="w-5 h-5" />
                  <span>Explorați produsele</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Cart Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 pb-24 md:pb-0 pt-32 md:pt-0">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 md:p-6">
                      <div className="flex items-start space-x-4">
                        {/* Checkbox */}
                        <button
                          onClick={() => handleSelectItem(item.product.id)}
                          className="flex-shrink-0 mt-1"
                        >
                          {selectedItems.has(item.product.id) ? (
                            <div className="w-5 h-5 bg-orange-500 rounded border-2 border-orange-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded hover:border-orange-400 transition-colors"></div>
                          )}
                        </button>

                        {/* Product Image */}
                        <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                          <Image
                            src={item.product.image || '/placeholder-product.jpg'}
                            alt={item.product.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                            {item.product.title}
                          </h3>
                          <p className="text-lg font-bold text-orange-600 mb-3">
                            {formatPrice(item.product.retail_price)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={isUpdating === item.id || item.quantity <= 1}
                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center font-medium">
                                {isUpdating === item.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mx-auto"></div>
                                ) : (
                                  item.quantity
                                )}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={isUpdating === item.id}
                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isUpdating === item.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Order Summary */}
              <div className="hidden md:block space-y-6">
                {/* Order Summary Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sumar comandă</h3>
                  
                  {/* Free Shipping Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">Livrare gratuită</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {getSelectedItemsTotal() >= 220 ? 'Gratuită' : `${formatPrice(220 - getSelectedItemsTotal())} rămase`}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((getSelectedItemsTotal() / 220) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>0 MDL</span>
                      <span>220 MDL</span>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Produse selectate ({getSelectedItemsCount()})</span>
                      <span className="font-medium">{formatPrice(getSelectedItemsTotal())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Livrare</span>
                      <span className="font-medium text-green-600">
                        {getShippingCost() === 0 ? 'Gratuită' : formatPrice(getShippingCost())}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-orange-600">
                          {formatPrice(getTotalWithShipping())}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={getSelectedItemsCount() === 0}
                      className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Finalizează comanda ({getSelectedItemsCount()})</span>
                    </button>
                    
                    <button
                      onClick={clearCart}
                      className="w-full px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                    >
                      Golește coșul
                    </button>
                  </div>
                </div>

                {/* Continue Shopping */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Continuă cumpărăturile</h4>
                  <Link
                    href="/products"
                    className="inline-flex items-center space-x-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-sm"
                  >
                    <Package className="w-4 h-4" />
                    <span>Explorați produsele</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer - Hidden on mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Mobile Fixed Payment Panel */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-40">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{getSelectedItemsCount()}</span> produse selectate
                </div>
                <div className="text-lg font-bold text-orange-600">
                  {formatPrice(getTotalWithShipping())}
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={getSelectedItemsCount() === 0}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cumpără ({getSelectedItemsCount()})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 