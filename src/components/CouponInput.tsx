'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCoupons } from '@/hooks/useSupabase'
import { useAuth } from '@/components/SupabaseAuthProvider'
import { 
  Tag, 
  CheckCircle, 
  X, 
  AlertCircle,
  Percent,
  DollarSign,
  Truck
} from 'lucide-react'
import { CouponValidation } from '@/types'

interface CouponInputProps {
  orderAmount: number
  onCouponApplied: (validation: CouponValidation) => void
  onCouponRemoved: () => void
  appliedCoupon?: CouponValidation
}

export default function CouponInput({ 
  orderAmount, 
  onCouponApplied, 
  onCouponRemoved, 
  appliedCoupon 
}: CouponInputProps) {
  const { user } = useAuth()
  const { validateCoupon } = useCoupons()
  const [couponCode, setCouponCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'MDL'
    }).format(price).replace(',', '.')
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !user) return

    setIsValidating(true)
    setError(null)

    try {
      const validation = await validateCoupon(couponCode, user.id, orderAmount)
      
      if (validation.isValid && validation.coupon && validation.discountAmount) {
        onCouponApplied(validation)
        setCouponCode('')
        setError(null)
      } else {
        setError(validation.error || 'Cupon invalid')
      }
    } catch (err) {
      setError('Eroare la validarea cuponului')
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemoveCoupon = () => {
    onCouponRemoved()
    setError(null)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-4 h-4" />
      case 'fixed':
        return <DollarSign className="w-4 h-4" />
      case 'shipping':
        return <Truck className="w-4 h-4" />
      default:
        return <Tag className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'text-blue-600'
      case 'fixed':
        return 'text-green-600'
      case 'shipping':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Tag className="w-5 h-5 mr-2" />
        Cupon de reducere
      </h3>

      <AnimatePresence mode="wait">
        {!appliedCoupon ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-3"
          >
            <div className="flex space-x-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Introduceți codul cuponului"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isValidating}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim() || isValidating}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isValidating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Se verifică...
                  </>
                ) : (
                  'Aplică'
                )}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md"
              >
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">{error}</span>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="applied"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-green-800">
                    {appliedCoupon.coupon?.title}
                  </div>
                  <div className="text-sm text-green-600">
                    Cod: <span className="font-mono bg-green-100 px-2 py-1 rounded">
                      {appliedCoupon.coupon?.code}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${getTypeColor(appliedCoupon.coupon?.type || '')}`}>
                  {appliedCoupon.coupon?.type === 'percentage' ? `${appliedCoupon.coupon.value}%` : 
                   appliedCoupon.coupon?.type === 'fixed' ? `${formatPrice(appliedCoupon.coupon.value)}` : 
                   'Livrare gratuită'}
                </div>
                <div className="text-sm text-green-600">
                  Economisiți {formatPrice(appliedCoupon.discountAmount || 0)}
                </div>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-gray-500">
              * Cuponul va fi aplicat la finalizarea comenzii
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 