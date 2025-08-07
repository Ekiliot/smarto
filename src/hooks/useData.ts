import { useState, useEffect } from 'react'
import { api, Product, Category, MetadataItem, User, ShippingMethod, PaymentMethod } from '@/lib/database'

// Products hook
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getProducts()
        if (mounted) {
          setProducts(data)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load products')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      mounted = false
    }
  }, [])

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProduct = await api.addProduct(product)
      setProducts(prev => [...prev, newProduct])
      return newProduct
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product')
      throw err
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const updatedProduct = await api.updateProduct(id, updates)
      if (updatedProduct) {
        setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p))
        return updatedProduct
      }
      throw new Error('Product not found')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product')
      throw err
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const success = await api.deleteProduct(id)
      if (success) {
        setProducts(prev => prev.filter(p => p.id !== id))
        return true
      }
      throw new Error('Product not found')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product')
      throw err
    }
  }

  const refresh = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getProducts()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refresh
  }
}

// Categories hook
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getCategories()
        if (mounted) {
          setCategories(data)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load categories')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadCategories()

    return () => {
      mounted = false
    }
  }, [])

  const addCategory = async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCategory = await api.addCategory(category)
      setCategories(prev => [...prev, newCategory])
      return newCategory
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category')
      throw err
    }
  }

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const updatedCategory = await api.updateCategory(id, updates)
      if (updatedCategory) {
        setCategories(prev => prev.map(c => c.id === id ? updatedCategory : c))
        return updatedCategory
      }
      throw new Error('Category not found')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category')
      throw err
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const success = await api.deleteCategory(id)
      if (success) {
        setCategories(prev => prev.filter(c => c.id !== id))
        return true
      }
      throw new Error('Category not found')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category')
      throw err
    }
  }

  const refresh = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getCategories()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refresh
  }
}

// Metadata hook
export function useMetadata() {
  const [metadata, setMetadata] = useState<MetadataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMetadata = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getMetadata()
      setMetadata(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metadata')
    } finally {
      setLoading(false)
    }
  }

  const addMetadata = async (metadataItem: Omit<MetadataItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newMetadata = await api.addMetadata(metadataItem)
      setMetadata(prev => [...prev, newMetadata])
      return newMetadata
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add metadata')
      throw err
    }
  }

  const updateMetadata = async (id: string, updates: Partial<MetadataItem>) => {
    try {
      const updatedMetadata = await api.updateMetadata(id, updates)
      if (updatedMetadata) {
        setMetadata(prev => prev.map(m => m.id === id ? updatedMetadata : m))
        return updatedMetadata
      }
      throw new Error('Metadata not found')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update metadata')
      throw err
    }
  }

  const deleteMetadata = async (id: string) => {
    try {
      const success = await api.deleteMetadata(id)
      if (success) {
        setMetadata(prev => prev.filter(m => m.id !== id))
        return true
      }
      throw new Error('Metadata not found')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete metadata')
      throw err
    }
  }

  useEffect(() => {
    loadMetadata()
  }, [loadMetadata])

  return {
    metadata,
    loading,
    error,
    addMetadata,
    updateMetadata,
    deleteMetadata,
    refresh: loadMetadata
  }
}

// Backup hook
export function useBackup() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const exportData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.exportData()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const importData = async (jsonData: string) => {
    try {
      setLoading(true)
      setError(null)
      await api.importData(jsonData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearAll = async () => {
    try {
      setLoading(true)
      setError(null)
      await api.clearAll()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear data')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    exportData,
    importData,
    clearAll
  }
}

// Users hook
export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getUsers()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const addUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newUser = await api.addUser(user)
      setUsers(prev => [...prev, newUser])
      return newUser
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user')
      throw err
    }
  }

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      setError(null)
      const updatedUser = await api.updateUser(id, updates)
      if (updatedUser) {
        setUsers(prev => prev.map(user => user.id === id ? updatedUser : user))
      }
      return updatedUser
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user')
      throw err
    }
  }

  const deleteUser = async (id: string) => {
    try {
      setError(null)
      const success = await api.deleteUser(id)
      if (success) {
        setUsers(prev => prev.filter(user => user.id !== id))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
      throw err
    }
  }

  // Load users on mount
  useEffect(() => {
    loadUsers()
  }, []) // Remove loadUsers from dependencies to avoid infinite loop

  return { users, loading, error, addUser, updateUser, deleteUser, refresh: loadUsers }
}

// Shipping Methods hook
export function useShippingMethods() {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadShippingMethods = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getShippingMethods()
      setShippingMethods(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shipping methods')
    } finally {
      setLoading(false)
    }
  }

  const addShippingMethod = async (method: Omit<ShippingMethod, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newMethod = await api.addShippingMethod(method)
      setShippingMethods(prev => [...prev, newMethod])
      return newMethod
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add shipping method')
      throw err
    }
  }

  const updateShippingMethod = async (id: string, updates: Partial<ShippingMethod>) => {
    try {
      setError(null)
      const updatedMethod = await api.updateShippingMethod(id, updates)
      if (updatedMethod) {
        setShippingMethods(prev => prev.map(method => method.id === id ? updatedMethod : method))
      }
      return updatedMethod
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update shipping method')
      throw err
    }
  }

  const deleteShippingMethod = async (id: string) => {
    try {
      setError(null)
      const success = await api.deleteShippingMethod(id)
      if (success) {
        setShippingMethods(prev => prev.filter(method => method.id !== id))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete shipping method')
      throw err
    }
  }

  // Load shipping methods on mount
  useEffect(() => {
    loadShippingMethods()
  }, []) // Remove loadShippingMethods from dependencies to avoid infinite loop

  return { shippingMethods, loading, error, addShippingMethod, updateShippingMethod, deleteShippingMethod, refresh: loadShippingMethods }
}

// Payment Methods hook
export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPaymentMethods = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getPaymentMethods()
      setPaymentMethods(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payment methods')
    } finally {
      setLoading(false)
    }
  }

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newMethod = await api.addPaymentMethod(method)
      setPaymentMethods(prev => [...prev, newMethod])
      return newMethod
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add payment method')
      throw err
    }
  }

  const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>) => {
    try {
      setError(null)
      const updatedMethod = await api.updatePaymentMethod(id, updates)
      if (updatedMethod) {
        setPaymentMethods(prev => prev.map(method => method.id === id ? updatedMethod : method))
      }
      return updatedMethod
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payment method')
      throw err
    }
  }

  const deletePaymentMethod = async (id: string) => {
    try {
      setError(null)
      const success = await api.deletePaymentMethod(id)
      if (success) {
        setPaymentMethods(prev => prev.filter(method => method.id !== id))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete payment method')
      throw err
    }
  }

  // Load payment methods on mount
  useEffect(() => {
    loadPaymentMethods()
  }, []) // Remove loadPaymentMethods from dependencies to avoid infinite loop

  return { paymentMethods, loading, error, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, refresh: loadPaymentMethods }
} 