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

// Additional types to replace 'any' usage

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

export interface BillingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

export interface TestResults {
  [key: string]: {
    success: boolean
    message: string
    data?: any
  }
}

export interface CookieOptions {
  name: string
  value: string
  path?: string
  domain?: string
  maxAge?: number
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

export interface TawkAPI {
  onLoad?: () => void
  onStatusChange?: (status: string) => void
  maximize?: () => void
  minimize?: () => void
  toggle?: () => void
  showWidget?: () => void
  hideWidget?: () => void
  toggleVisibility?: () => void
  endChat?: () => void
}

export interface UserUpdates {
  name?: string
  email?: string
  role?: 'admin' | 'user'
  is_active?: boolean
  marketing_consent?: boolean
  phone?: string
  address?: string
}

export interface OrderStatusUpdate {
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}

export interface PaymentStatusUpdate {
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
}

export interface ShippingMethodData {
  name: string
  type: 'home' | 'pickup' | 'express'
  min_order_amount: number
  max_order_amount?: number
  shipping_cost: number
  free_shipping_threshold?: number
  estimated_days?: number
  description?: string
  is_active: boolean
}

export interface PaymentMethodData {
  name: string
  type: 'card' | 'cash' | 'bank_transfer' | 'online'
  fee: number
  is_active: boolean
}

export interface CouponType {
  type: 'percentage' | 'fixed' | 'shipping'
}

export interface UserType {
  user_type: 'all' | 'new' | 'existing'
}

export interface TimeRange {
  timeRange: '7d' | '30d' | '90d' | '1y'
} 