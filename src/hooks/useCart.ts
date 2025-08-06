import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: {
    id: string
    title: string
    retail_price: string | number
    compare_price?: string | number
    image?: string
    stock: number
  }
}

export interface CartItemWithProduct extends CartItem {
  product: {
    id: string
    title: string
    retail_price: string | number
    compare_price?: string | number
    image?: string
    stock: number
  }
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Получить текущего пользователя
  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  // Загрузить корзину
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const user = await getCurrentUser()
      if (!user) {
        setCartItems([])
        return
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(
            id,
            title,
            retail_price,
            compare_price,
            image,
            stock
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setCartItems(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching cart')
      console.error('Error fetching cart:', err)
    } finally {
      setLoading(false)
    }
  }, []) // Пустой массив зависимостей, так как функция не зависит от внешних переменных

  // Добавить товар в корзину
  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    try {
      const user = await getCurrentUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Проверить, есть ли уже товар в корзине
      const { data: existingItem, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking existing item:', checkError) // Отладка
        throw checkError
      }

      if (existingItem) {
        // Обновить количество
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)

        if (error) {
          console.error('Error updating quantity:', error) // Отладка
          throw error
        }
      } else {
        // Добавить новый товар
        const { error } = await supabase
          .from('cart_items')
          .insert([{
            user_id: user.id,
            product_id: productId,
            quantity
          }])

        if (error) {
          console.error('Error adding item to cart:', error) // Отладка
          throw error
        }
      }

      await fetchCart()
    } catch (err) {
      console.error('Error in addToCart:', err) // Отладка
      setError(err instanceof Error ? err.message : 'Error adding to cart')
      throw err
    }
  }, [fetchCart])

  // Обновить количество товара
  const updateQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(cartItemId)
        return
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)

      if (error) throw error
      await fetchCart()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating quantity')
      throw err
    }
  }, [fetchCart])

  // Удалить товар из корзины
  const removeFromCart = useCallback(async (cartItemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)

      if (error) throw error
      await fetchCart()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error removing from cart')
      throw err
    }
  }, [fetchCart])

  // Очистить корзину
  const clearCart = useCallback(async () => {
    try {
      const user = await getCurrentUser()
      if (!user) return

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error
      await fetchCart()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error clearing cart')
      throw err
    }
  }, [fetchCart])

  // Получить общую сумму корзины
  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.product.retail_price === 'string' 
        ? parseFloat(item.product.retail_price) 
        : item.product.retail_price
      return total + (price * item.quantity)
    }, 0)
  }, [cartItems])

  // Получить количество товаров в корзине
  const getCartCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }, [cartItems])

  // Загрузить корзину при изменении аутентификации
  useEffect(() => {
    const loadCart = async () => {
      try {
        const user = await getCurrentUser()
        if (user) {
          await fetchCart()
        } else {
          setCartItems([])
        }
      } catch (error) {
        console.error('Error loading cart:', error)
        setCartItems([])
      }
    }

    loadCart()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchCart()
        } else if (event === 'SIGNED_OUT') {
          setCartItems([])
        }
      } catch (error) {
        console.error('Error handling auth state change:', error)
      }
    })

    return () => subscription.unsubscribe()
  }, []) // Убираем fetchCart из зависимостей

  return {
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getCartCount,
    refresh: fetchCart
  }
} 