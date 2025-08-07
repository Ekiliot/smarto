import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const formatPrice = (price: number): string => {
  return price.toLocaleString('ro-RO')
}

// Types
export interface Product {
  id: string
  title: string
  description?: string
  cost_price: number
  retail_price: number
  compare_price?: number
  image?: string
  category_id?: string
  status: 'draft' | 'published' | 'archived'
  stock: number
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  slug: string
  image?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MetadataType {
  id: string
  name: string
  type: 'text' | 'number' | 'boolean' | 'select'
  options: string[]
  is_custom: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  is_active: boolean
  first_name?: string
  last_name?: string
  phone?: string
  address?: string
  marketing_consent: boolean
  created_at: string
  updated_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

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

export interface PaymentMethod {
  id: string
  name: string
  type: 'card' | 'cash' | 'bank_transfer' | 'online'
  fee: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  shipping_cost: number
  total_amount: number
  shipping_method_id?: string
  shipping_address: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  billing_address: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  notes?: string
  created_at: string
  updated_at: string
  user?: {
    name: string
    email: string
  }
  shipping_method?: {
    name: string
  }
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_title: string
  product_price: number
  quantity: number
  total_price: number
  created_at: string
  product?: {
    image?: string
  }
}

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
  original_price: number
  discounted_price: number
  discount_amount: number
  quantity: number
  created_at: string
  updated_at: string
}

// Products Hook
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    console.log('=== useProducts: fetchProducts called ===')
    try {
      setLoading(true)
      console.log('useProducts: Making database query...')
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('useProducts: Database error:', error)
        throw error
      }
      
      console.log('useProducts: Query successful, products count:', data?.length || 0)
      setProducts(data || [])
    } catch (err) {
      console.error('useProducts: Error in fetchProducts:', err)
      setError(err instanceof Error ? err.message : 'Error fetching products')
    } finally {
      console.log('useProducts: Setting loading to false')
      setLoading(false)
    }
  }, [])

  const addProduct = useCallback(async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()

      if (error) throw error
      await fetchProducts()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding product')
      throw err
    }
  }, [fetchProducts])

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      await fetchProducts()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating product')
      throw err
    }
  }, [fetchProducts])

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting product')
      throw err
    }
  }, [fetchProducts])

  useEffect(() => {
    console.log('=== useProducts: useEffect triggered ===')
    fetchProducts()
  }, [fetchProducts])

  console.log('=== useProducts: Hook state ===')
  console.log('Loading:', loading)
  console.log('Products count:', products.length)
  console.log('Error:', error)

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refresh: fetchProducts
  }
}

// Categories Hook
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching categories')
    } finally {
      setLoading(false)
    }
  }, [])

  const addCategory = useCallback(async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()

      if (error) throw error
      await fetchCategories()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding category')
      throw err
    }
  }, [fetchCategories])

  const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      await fetchCategories()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating category')
      throw err
    }
  }, [fetchCategories])

  const deleteCategory = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting category')
      throw err
    }
  }, [fetchCategories])

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refresh: fetchCategories
  }
}

// Metadata Types Hook
export function useMetadataTypes() {
  const [metadataTypes, setMetadataTypes] = useState<MetadataType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetadataTypes = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('metadata_types')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setMetadataTypes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching metadata types')
    } finally {
      setLoading(false)
    }
  }, [])

  const addMetadataType = useCallback(async (metadataType: Omit<MetadataType, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('metadata_types')
        .insert([metadataType])
        .select()

      if (error) throw error
      await fetchMetadataTypes()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding metadata type')
      throw err
    }
  }, [fetchMetadataTypes])

  const updateMetadataType = useCallback(async (id: string, updates: Partial<MetadataType>) => {
    try {
      const { data, error } = await supabase
        .from('metadata_types')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      await fetchMetadataTypes()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating metadata type')
      throw err
    }
  }, [fetchMetadataTypes])

  const deleteMetadataType = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('metadata_types')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchMetadataTypes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting metadata type')
      throw err
    }
  }, [fetchMetadataTypes])

  useEffect(() => {
    fetchMetadataTypes()
  }, [])

  return {
    metadataTypes,
    loading,
    error,
    addMetadataType,
    updateMetadataType,
    deleteMetadataType,
    refresh: fetchMetadataTypes
  }
}

// Users Hook - Only accessible by admins
export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch all users (RLS disabled - all authenticated users can access)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching users')
    } finally {
      setLoading(false)
    }
  }, [])

  const addUser = useCallback(async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select()

      if (error) throw error
      await fetchUsers()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding user')
      throw err
    }
  }, [fetchUsers])

  const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      await fetchUsers()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating user')
      throw err
    }
  }, [fetchUsers])

  const deleteUser = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting user')
      throw err
    }
  }, [fetchUsers])

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    refresh: fetchUsers
  }
}

// User Role Hook
export function useUserRole() {
  const [role, setRole] = useState<'admin' | 'user' | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserRole = useCallback(async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setRole(null)
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setRole(data?.role || 'user')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching user role')
      setRole('user') // Default to user role on error
    } finally {
      setLoading(false)
    }
  }, [])

  const isAdmin = useCallback(() => {
    return role === 'admin'
  }, [role])

  useEffect(() => {
    fetchUserRole()
  }, [fetchUserRole])

  return {
    role,
    isAdmin: isAdmin(),
    loading,
    error,
    refresh: fetchUserRole
  }
}

// Shipping Methods Hook
export function useShippingMethods() {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchShippingMethods = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('shipping_methods')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setShippingMethods(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching shipping methods')
    } finally {
      setLoading(false)
    }
  }, [])

  const addShippingMethod = useCallback(async (shippingMethod: Omit<ShippingMethod, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('shipping_methods')
        .insert([shippingMethod])
        .select()

      if (error) throw error
      await fetchShippingMethods()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding shipping method')
      throw err
    }
  }, [fetchShippingMethods])

  const updateShippingMethod = useCallback(async (id: string, updates: Partial<ShippingMethod>) => {
    try {
      const { data, error } = await supabase
        .from('shipping_methods')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      await fetchShippingMethods()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating shipping method')
      throw err
    }
  }, [fetchShippingMethods])

  const deleteShippingMethod = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('shipping_methods')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchShippingMethods()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting shipping method')
      throw err
    }
  }, [fetchShippingMethods])

  useEffect(() => {
    fetchShippingMethods()
  }, [])

  return {
    shippingMethods,
    loading,
    error,
    addShippingMethod,
    updateShippingMethod,
    deleteShippingMethod,
    refresh: fetchShippingMethods
  }
}

// Payment Methods Hook
export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setPaymentMethods(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching payment methods')
    } finally {
      setLoading(false)
    }
  }, [])

  const addPaymentMethod = useCallback(async (paymentMethod: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .insert([paymentMethod])
        .select()

      if (error) throw error
      await fetchPaymentMethods()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding payment method')
      throw err
    }
  }, [fetchPaymentMethods])

  const updatePaymentMethod = useCallback(async (id: string, updates: Partial<PaymentMethod>) => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      await fetchPaymentMethods()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating payment method')
      throw err
    }
  }, [fetchPaymentMethods])

  const deletePaymentMethod = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchPaymentMethods()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting payment method')
      throw err
    }
  }, [fetchPaymentMethods])

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  return {
    paymentMethods,
    loading,
    error,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    refresh: fetchPaymentMethods
  }
}

// Orders Hook
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      console.log('Fetching orders...')
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:users(name, email),
          shipping_method:shipping_methods(name),
          items:order_items(
            *,
            product:products(image)
          )
        `)
        .order('created_at', { ascending: false })

      console.log('Orders query result:', { data, error })

      if (error) throw error
      setOrders(data || [])
      console.log('Orders set:', data?.length || 0)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Error fetching orders')
    } finally {
      setLoading(false)
    }
  }, [])

  const createOrder = useCallback(async (orderData: {
    user_id: string
    order_number: string
    subtotal: number
    shipping_cost: number
    total_amount: number
    shipping_method_id?: string
    shipping_address: any
    billing_address: any
    payment_method: string
    items: Array<{
      product_id: string
      product_title: string
      product_price: number
      quantity: number
      total_price: number
    }>
  }) => {
    try {
      console.log('createOrder called with:', orderData)
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: orderData.user_id,
          order_number: orderData.order_number,
          subtotal: orderData.subtotal,
          shipping_cost: orderData.shipping_cost,
          total_amount: orderData.total_amount,
          shipping_method_id: orderData.shipping_method_id,
          shipping_address: orderData.shipping_address,
          billing_address: orderData.billing_address,
          payment_method: orderData.payment_method,
          payment_status: 'paid',
          status: 'confirmed'
        }])
        .select()
        .single()

      if (orderError) {
        console.error('Error creating order:', orderError)
        throw orderError
      }

      console.log('Order created:', order)

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        ...item
      }))

      console.log('Creating order items:', orderItems)

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Error creating order items:', itemsError)
        throw itemsError
      }

      console.log('Order items created successfully')

      await fetchOrders()
      return order
    } catch (err) {
      console.error('Error in createOrder:', err)
      setError(err instanceof Error ? err.message : 'Error creating order')
      throw err
    }
  }, [fetchOrders])

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error
      await fetchOrders()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating order status')
      throw err
    }
  }, [fetchOrders])

  const updatePaymentStatus = useCallback(async (orderId: string, paymentStatus: Order['payment_status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus })
        .eq('id', orderId)

      if (error) throw error
      await fetchOrders()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating payment status')
      throw err
    }
  }, [fetchOrders])

  useEffect(() => {
    fetchOrders()
  }, [])

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    refresh: fetchOrders
  }
} 

  // Bundle hooks
  export const useBundles = () => {
    const [bundles, setBundles] = useState<Bundle[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchBundles = useCallback(async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('bundles')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setBundles(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching bundles')
      } finally {
        setLoading(false)
      }
    }, [])

    const createBundle = useCallback(async (bundle: Omit<Bundle, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase
          .from('bundles')
          .insert(bundle)
          .select()
          .single()

        if (error) throw error
        await fetchBundles()
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error creating bundle')
        throw err
      }
    }, [fetchBundles])

    const updateBundle = useCallback(async (id: string, updates: Partial<Bundle>) => {
      try {
        const { data, error } = await supabase
          .from('bundles')
          .update(updates)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        await fetchBundles()
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error updating bundle')
        throw err
      }
    }, [fetchBundles])

    const deleteBundle = useCallback(async (id: string) => {
      try {
        const { error } = await supabase
          .from('bundles')
          .delete()
          .eq('id', id)

        if (error) throw error
        await fetchBundles()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error deleting bundle')
        throw err
      }
    }, [fetchBundles])

    useEffect(() => {
      fetchBundles()
    }, [fetchBundles])

    return {
      bundles,
      loading,
      error,
      fetchBundles,
      createBundle,
      updateBundle,
      deleteBundle
    }
  }

  export const useBundleProducts = () => {
    const [bundleProducts, setBundleProducts] = useState<BundleProduct[]>([])
    const [loading, setLoading] = useState(true)

    const fetchBundleProducts = useCallback(async (bundleId?: string) => {
      try {
        setLoading(true)
        let query = supabase
          .from('bundle_products')
          .select('*')

        if (bundleId) {
          query = query.eq('bundle_id', bundleId)
        }

        const { data, error } = await query
        if (error) throw error
        setBundleProducts(data || [])
      } catch (err) {
        console.error('Error fetching bundle products:', err)
      } finally {
        setLoading(false)
      }
    }, [])

    const addProductToBundle = useCallback(async (bundleId: string, productId: string) => {
      try {
        const { error } = await supabase
          .from('bundle_products')
          .insert({ bundle_id: bundleId, product_id: productId })

        if (error) throw error
        await fetchBundleProducts(bundleId)
      } catch (err) {
        console.error('Error adding product to bundle:', err)
        throw err
      }
    }, [fetchBundleProducts])

    const removeProductFromBundle = useCallback(async (bundleId: string, productId: string) => {
      try {
        const { error } = await supabase
          .from('bundle_products')
          .delete()
          .eq('bundle_id', bundleId)
          .eq('product_id', productId)

        if (error) throw error
        await fetchBundleProducts(bundleId)
      } catch (err) {
        console.error('Error removing product from bundle:', err)
        throw err
      }
    }, [fetchBundleProducts])

    return {
      bundleProducts,
      loading,
      fetchBundleProducts,
      addProductToBundle,
      removeProductFromBundle
    }
  }

  export const useBundleSuggestions = () => {
    const [bundleSuggestions, setBundleSuggestions] = useState<BundleSuggestion[]>([])
    const [loading, setLoading] = useState(true)

    const fetchBundleSuggestions = useCallback(async (bundleId?: string) => {
      try {
        setLoading(true)
        let query = supabase
          .from('bundle_suggestions')
          .select('*')

        if (bundleId) {
          query = query.eq('bundle_id', bundleId)
        }

        const { data, error } = await query
        if (error) throw error
        setBundleSuggestions(data || [])
      } catch (err) {
        console.error('Error fetching bundle suggestions:', err)
      } finally {
        setLoading(false)
      }
    }, [])

    const addBundleSuggestion = useCallback(async (bundleId: string, productId: string) => {
      try {
        const { error } = await supabase
          .from('bundle_suggestions')
          .insert({ bundle_id: bundleId, product_id: productId })

        if (error) throw error
        await fetchBundleSuggestions(bundleId)
      } catch (err) {
        console.error('Error adding bundle suggestion:', err)
        throw err
      }
    }, [fetchBundleSuggestions])

    const removeBundleSuggestion = useCallback(async (bundleId: string, productId: string) => {
      try {
        const { error } = await supabase
          .from('bundle_suggestions')
          .delete()
          .eq('bundle_id', bundleId)
          .eq('product_id', productId)

        if (error) throw error
        await fetchBundleSuggestions(bundleId)
      } catch (err) {
        console.error('Error removing bundle suggestion:', err)
        throw err
      }
    }, [fetchBundleSuggestions])

    return {
      bundleSuggestions,
      loading,
      fetchBundleSuggestions,
      addBundleSuggestion,
      removeBundleSuggestion
    }
  }

  export const useCartBundles = () => {
    const [cartBundleItems, setCartBundleItems] = useState<CartBundleItem[]>([])
    const [loading, setLoading] = useState(true)

    const fetchCartBundleItems = useCallback(async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('cart_bundle_items')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setCartBundleItems(data || [])
      } catch (err) {
        console.error('Error fetching cart bundle items:', err)
      } finally {
        setLoading(false)
      }
    }, [])

    const addBundleToCart = useCallback(async (bundleId: string, productId: string, originalPrice: number, discountPercentage: number) => {
      try {
        const discountedPrice = originalPrice * (1 - discountPercentage / 100)
        const discountAmount = originalPrice - discountedPrice

        const { error } = await supabase
          .from('cart_bundle_items')
          .insert({
            bundle_id: bundleId,
            product_id: productId,
            original_price: originalPrice,
            discounted_price: discountedPrice,
            discount_amount: discountAmount
          })

        if (error) throw error
        await fetchCartBundleItems()
      } catch (err) {
        console.error('Error adding bundle to cart:', err)
        throw err
      }
    }, [fetchCartBundleItems])

    const removeBundleFromCart = useCallback(async (id: string) => {
      try {
        const { error } = await supabase
          .from('cart_bundle_items')
          .delete()
          .eq('id', id)

        if (error) throw error
        await fetchCartBundleItems()
      } catch (err) {
        console.error('Error removing bundle from cart:', err)
        throw err
      }
    }, [fetchCartBundleItems])

    const updateBundleQuantity = useCallback(async (id: string, quantity: number) => {
      try {
        const { error } = await supabase
          .from('cart_bundle_items')
          .update({ quantity })
          .eq('id', id)

        if (error) throw error
        await fetchCartBundleItems()
      } catch (err) {
        console.error('Error updating bundle quantity:', err)
        throw err
      }
    }, [fetchCartBundleItems])

    useEffect(() => {
      fetchCartBundleItems()
    }, [fetchCartBundleItems])

    return {
      cartBundleItems,
      loading,
      fetchCartBundleItems,
      addBundleToCart,
      removeBundleFromCart,
      updateBundleQuantity
    }
  } 

  // Coupon hooks
  export const useCoupons = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCoupons = useCallback(async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setCoupons(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching coupons')
      } finally {
        setLoading(false)
      }
    }, [])

    const createCoupon = useCallback(async (coupon: Omit<Coupon, 'id' | 'created_at' | 'updated_at' | 'used_count'>) => {
      try {
        const { data, error } = await supabase
          .from('coupons')
          .insert(coupon)
          .select()
          .single()

        if (error) throw error
        await fetchCoupons()
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error creating coupon')
        throw err
      }
    }, [fetchCoupons])

    const updateCoupon = useCallback(async (id: string, updates: Partial<Coupon>) => {
      try {
        const { data, error } = await supabase
          .from('coupons')
          .update(updates)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        await fetchCoupons()
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error updating coupon')
        throw err
      }
    }, [fetchCoupons])

    const deleteCoupon = useCallback(async (id: string) => {
      try {
        const { error } = await supabase
          .from('coupons')
          .delete()
          .eq('id', id)

        if (error) throw error
        await fetchCoupons()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error deleting coupon')
        throw err
      }
    }, [fetchCoupons])

    const validateCoupon = useCallback(async (code: string, userId: string, orderAmount: number): Promise<CouponValidation> => {
      try {
        const { data: coupon, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('code', code.toUpperCase())
          .eq('is_active', true)
          .single()

        if (error || !coupon) {
          return { isValid: false, error: 'Cupon invalid sau expirat' }
        }

        // Check if coupon is expired
        if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
          return { isValid: false, error: 'Cuponul a expirat' }
        }

        // Check if coupon is not yet valid
        if (new Date(coupon.valid_from) > new Date()) {
          return { isValid: false, error: 'Cuponul nu este încă valid' }
        }

        // Check usage limit
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
          return { isValid: false, error: 'Cuponul a fost folosit de prea multe ori' }
        }

        // Check minimum order amount
        if (orderAmount < coupon.min_order_amount) {
          return { isValid: false, error: `Valoarea minimă a comenzii trebuie să fie ${formatPrice(coupon.min_order_amount)}` }
        }

        // Check if user already used this coupon
        const { data: usage } = await supabase
          .from('coupon_usage')
          .select('*')
          .eq('coupon_id', coupon.id)
          .eq('user_id', userId)

        if (usage && usage.length > 0) {
          return { isValid: false, error: 'Ați folosit deja acest cupon' }
        }

        // Calculate discount amount
        let discountAmount = 0
        if (coupon.type === 'percentage') {
          discountAmount = orderAmount * (coupon.value / 100)
          if (coupon.max_discount) {
            discountAmount = Math.min(discountAmount, coupon.max_discount)
          }
        } else if (coupon.type === 'fixed') {
          discountAmount = coupon.value
        } else if (coupon.type === 'shipping') {
          discountAmount = coupon.value
        }

        return {
          isValid: true,
          coupon,
          discountAmount
        }
      } catch (err) {
        return { isValid: false, error: 'Eroare la validarea cuponului' }
      }
    }, [])

    useEffect(() => {
      fetchCoupons()
    }, [fetchCoupons])

    return {
      coupons,
      loading,
      error,
      fetchCoupons,
      createCoupon,
      updateCoupon,
      deleteCoupon,
      validateCoupon
    }
  }

  export const useCouponProducts = () => {
    const [couponProducts, setCouponProducts] = useState<CouponProduct[]>([])
    const [loading, setLoading] = useState(true)

    const fetchCouponProducts = useCallback(async (couponId?: string) => {
      try {
        setLoading(true)
        let query = supabase
          .from('coupon_products')
          .select('*')

        if (couponId) {
          query = query.eq('coupon_id', couponId)
        }

        const { data, error } = await query
        if (error) throw error
        setCouponProducts(data || [])
      } catch (err) {
        console.error('Error fetching coupon products:', err)
      } finally {
        setLoading(false)
      }
    }, [])

    const addProductToCoupon = useCallback(async (couponId: string, productId: string) => {
      try {
        const { error } = await supabase
          .from('coupon_products')
          .insert({ coupon_id: couponId, product_id: productId })

        if (error) throw error
        await fetchCouponProducts(couponId)
      } catch (err) {
        console.error('Error adding product to coupon:', err)
        throw err
      }
    }, [fetchCouponProducts])

    const removeProductFromCoupon = useCallback(async (couponId: string, productId: string) => {
      try {
        const { error } = await supabase
          .from('coupon_products')
          .delete()
          .eq('coupon_id', couponId)
          .eq('product_id', productId)

        if (error) throw error
        await fetchCouponProducts(couponId)
      } catch (err) {
        console.error('Error removing product from coupon:', err)
        throw err
      }
    }, [fetchCouponProducts])

    return {
      couponProducts,
      loading,
      fetchCouponProducts,
      addProductToCoupon,
      removeProductFromCoupon
    }
  }

  export const useCouponCategories = () => {
    const [couponCategories, setCouponCategories] = useState<CouponCategory[]>([])
    const [loading, setLoading] = useState(true)

    const fetchCouponCategories = useCallback(async (couponId?: string) => {
      try {
        setLoading(true)
        let query = supabase
          .from('coupon_categories')
          .select('*')

        if (couponId) {
          query = query.eq('coupon_id', couponId)
        }

        const { data, error } = await query
        if (error) throw error
        setCouponCategories(data || [])
      } catch (err) {
        console.error('Error fetching coupon categories:', err)
      } finally {
        setLoading(false)
      }
    }, [])

    const addCategoryToCoupon = useCallback(async (couponId: string, categoryId: string) => {
      try {
        const { error } = await supabase
          .from('coupon_categories')
          .insert({ coupon_id: couponId, category_id: categoryId })

        if (error) throw error
        await fetchCouponCategories(couponId)
      } catch (err) {
        console.error('Error adding category to coupon:', err)
        throw err
      }
    }, [fetchCouponCategories])

    const removeCategoryFromCoupon = useCallback(async (couponId: string, categoryId: string) => {
      try {
        const { error } = await supabase
          .from('coupon_categories')
          .delete()
          .eq('coupon_id', couponId)
          .eq('category_id', categoryId)

        if (error) throw error
        await fetchCouponCategories(couponId)
      } catch (err) {
        console.error('Error removing category from coupon:', err)
        throw err
      }
    }, [fetchCouponCategories])

    return {
      couponCategories,
      loading,
      fetchCouponCategories,
      addCategoryToCoupon,
      removeCategoryFromCoupon
    }
  }

  export const useCouponUsage = () => {
    const [couponUsage, setCouponUsage] = useState<CouponUsage[]>([])
    const [loading, setLoading] = useState(true)

    const fetchCouponUsage = useCallback(async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('coupon_usage')
          .select('*')
          .order('used_at', { ascending: false })

        if (error) throw error
        setCouponUsage(data || [])
      } catch (err) {
        console.error('Error fetching coupon usage:', err)
      } finally {
        setLoading(false)
      }
    }, [])

    const recordCouponUsage = useCallback(async (couponId: string, userId: string, orderId: string, discountAmount: number) => {
      try {
        const { error } = await supabase
          .from('coupon_usage')
          .insert({
            coupon_id: couponId,
            user_id: userId,
            order_id: orderId,
            discount_amount: discountAmount
          })

        if (error) throw error

        // Update coupon used count
        await supabase
          .from('coupons')
          .update({ used_count: supabase.rpc('increment') })
          .eq('id', couponId)

        await fetchCouponUsage()
      } catch (err) {
        console.error('Error recording coupon usage:', err)
        throw err
      }
    }, [fetchCouponUsage])

    useEffect(() => {
      fetchCouponUsage()
    }, [fetchCouponUsage])

    return {
      couponUsage,
      loading,
      fetchCouponUsage,
      recordCouponUsage
    }
  } 

  // Bundle offers hook
  export const useBundleOffers = () => {
    const [bundleOffers, setBundleOffers] = useState<BundleOffer[]>([])
    const [loading, setLoading] = useState(true)

    const fetchBundleOffers = useCallback(async (productId?: string) => {
      try {
        setLoading(true)
        
        // Get all active bundles
        const { data: bundles, error: bundlesError } = await supabase
          .from('bundles')
          .select('*')
          .eq('is_active', true)

        if (bundlesError) throw bundlesError

        const offers: BundleOffer[] = []

        for (const bundle of bundles || []) {
          // Get bundle products
          const { data: bundleProducts } = await supabase
            .from('bundle_products')
            .select('product_id')
            .eq('bundle_id', bundle.id)

          // Get bundle suggestions
          const { data: bundleSuggestions } = await supabase
            .from('bundle_suggestions')
            .select('product_id')
            .eq('bundle_id', bundle.id)

          const productIds = bundleProducts?.map(bp => bp.product_id) || []
          const suggestionIds = bundleSuggestions?.map(bs => bs.product_id) || []

          // If productId is provided, check if this bundle should be shown for this product
          if (productId) {
            const shouldShow = suggestionIds.includes(productId) || productIds.includes(productId)
            if (!shouldShow) continue
          }

          // Get products for this bundle
          const { data: products } = await supabase
            .from('products')
            .select('*')
            .in('id', productIds)

          if (products && products.length > 0) {
            const totalOriginalPrice = products.reduce((sum, product) => sum + product.retail_price, 0)
            const totalDiscount = totalOriginalPrice * (bundle.discount_percentage / 100)
            const totalDiscountedPrice = totalOriginalPrice - totalDiscount

            offers.push({
              bundle,
              products,
              totalOriginalPrice,
              totalDiscountedPrice,
              totalDiscount
            })
          }
        }

        setBundleOffers(offers)
      } catch (err) {
        console.error('Error fetching bundle offers:', err)
      } finally {
        setLoading(false)
      }
    }, [])

    useEffect(() => {
      fetchBundleOffers()
    }, [fetchBundleOffers])

    return {
      bundleOffers,
      loading,
      fetchBundleOffers
    }
  }

// Wishlist Hook
export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          *,
          product:products(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setWishlistItems(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching wishlist')
    } finally {
      setLoading(false)
    }
  }, [])

  const addToWishlist = useCallback(async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('wishlist_items')
        .insert([{ 
          user_id: user.id,
          product_id: productId 
        }])

      if (error) throw error
      await fetchWishlist()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding to wishlist')
      throw err
    }
  }, [fetchWishlist])

  const removeFromWishlist = useCallback(async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('product_id', productId)
        .eq('user_id', user.id)

      if (error) throw error
      await fetchWishlist()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error removing from wishlist')
      throw err
    }
  }, [fetchWishlist])

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some(item => item.product_id === productId)
  }, [wishlistItems])

  const getWishlistCount = useCallback(() => {
    return wishlistItems.length
  }, [wishlistItems])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  return {
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    refresh: fetchWishlist
  }
} 

// Coupon types
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

export interface BundleOffer {
  bundle: Bundle
  products: Product[]
  totalOriginalPrice: number
  totalDiscountedPrice: number
  totalDiscount: number
} 