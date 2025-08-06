import { Product, Category } from '@/hooks/useSupabase'

export type { Product, Category }

export interface Bundle {
  id: string
  name: string
  description?: string
  discount_percentage: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BundleProduct {
  id: string
  bundle_id: string
  product_id: string
  created_at: string
}

export interface BundleSuggestion {
  id: string
  bundle_id: string
  product_id: string
  created_at: string
}

export interface CartBundleItem {
  id: string
  user_id: string
  bundle_id: string
  product_id: string
  quantity: number
  original_price: number
  discounted_price: number
  discount_amount: number
  created_at: string
  updated_at: string
}

export interface BundleWithProducts extends Bundle {
  products: Product[]
  suggestions: Product[]
}

export interface BundleOffer {
  bundle: Bundle
  products: Product[]
  totalOriginalPrice: number
  totalDiscountedPrice: number
  totalDiscount: number
}

export interface Coupon {
  id: string
  code: string
  title: string
  description?: string
  type: 'percentage' | 'fixed' | 'shipping'
  value: number
  min_order_amount: number
  max_discount?: number
  usage_limit?: number
  used_count: number
  user_type: 'all' | 'new' | 'existing'
  new_user_days: number
  valid_from: string
  valid_until?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CouponProduct {
  id: string
  coupon_id: string
  product_id: string
  created_at: string
}

export interface CouponCategory {
  id: string
  coupon_id: string
  category_id: string
  created_at: string
}

export interface CouponUsage {
  id: string
  coupon_id: string
  user_id: string
  order_id?: string
  discount_amount: number
  used_at: string
}

export interface CouponValidation {
  isValid: boolean
  error?: string
  coupon?: Coupon
  discountAmount?: number
}

export interface CouponWithDetails extends Coupon {
  products: Product[]
  categories: Category[]
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
} 