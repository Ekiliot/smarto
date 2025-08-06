import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface ShippingMethod {
  id: string
  name: string
  type: 'home' | 'pickup' | 'express'
  min_order_amount: number
  max_order_amount?: number
  shipping_cost: number
  free_shipping_threshold?: number
  estimated_days?: number
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ShippingCalculation {
  method: ShippingMethod
  cost: number
  isFree: boolean
  estimatedDays: number
}

export function useShipping() {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchShippingMethods = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('shipping_methods')
        .select('*')
        .eq('is_active', true)
        .order('type', { ascending: true })
        .order('min_order_amount', { ascending: true })

      if (error) throw error
      
      console.log('Shipping methods from DB:', data)
      
      setShippingMethods(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching shipping methods')
    } finally {
      setLoading(false)
    }
  }, [])

  // Calculate shipping cost for a given order amount
  const calculateShipping = useCallback((orderAmount: number): ShippingCalculation[] => {
    console.log('calculateShipping called with orderAmount:', orderAmount)
    console.log('Available shipping methods:', shippingMethods.length)
    
    const calculations: ShippingCalculation[] = []
    
    // Group methods by type
    const methodsByType = shippingMethods.reduce((acc, method) => {
      if (!acc[method.type]) {
        acc[method.type] = []
      }
      acc[method.type].push(method)
      return acc
    }, {} as Record<string, ShippingMethod[]>)

    console.log('Methods by type:', methodsByType)

    // Calculate for each type
    Object.entries(methodsByType).forEach(([type, methods]) => {
      console.log(`Processing type: ${type}, methods:`, methods.length)
      
      // Find the applicable method for this order amount
      const applicableMethod = methods.find(method => {
        const minAmount = method.min_order_amount
        const maxAmount = method.max_order_amount || Infinity
        const isApplicable = orderAmount >= minAmount && orderAmount < maxAmount
        console.log(`Method ${method.name}: min=${minAmount}, max=${maxAmount}, applicable=${isApplicable}`)
        return isApplicable
      })

      if (applicableMethod) {
        let cost = applicableMethod.shipping_cost
        let isFree = false

        // Check if free shipping threshold is met
        if (applicableMethod.free_shipping_threshold && orderAmount >= applicableMethod.free_shipping_threshold) {
          cost = 0
          isFree = true
        }

        console.log(`Selected method: ${applicableMethod.name}, cost: ${cost}, isFree: ${isFree}, threshold: ${applicableMethod.free_shipping_threshold}`)

        calculations.push({
          method: applicableMethod,
          cost,
          isFree,
          estimatedDays: applicableMethod.estimated_days || 0
        })
      }
    })

    console.log('Final calculations:', calculations)
    return calculations
  }, [shippingMethods])

  // Get available shipping methods for an order amount
  const getAvailableMethods = useCallback((orderAmount: number): ShippingCalculation[] => {
    return calculateShipping(orderAmount)
  }, [calculateShipping])

  // Get cheapest shipping method
  const getCheapestMethod = useCallback((orderAmount: number): ShippingCalculation | null => {
    const methods = calculateShipping(orderAmount)
    if (methods.length === 0) return null
    
    return methods.reduce((cheapest, current) => {
      return current.cost < cheapest.cost ? current : cheapest
    })
  }, [calculateShipping])

  useEffect(() => {
    fetchShippingMethods()
  }, [fetchShippingMethods])

  return {
    shippingMethods,
    loading,
    error,
    calculateShipping,
    getAvailableMethods,
    getCheapestMethod,
    refresh: fetchShippingMethods
  }
} 