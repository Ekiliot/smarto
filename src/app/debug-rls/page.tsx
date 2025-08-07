'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugRLS() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Получаем текущего пользователя
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const testRLS = async () => {
    setLoading(true)
    const testResults: any = {}

    try {
      // Тест 1: Проверяем пользователя
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      testResults.user = { user, error: userError }

      // Тест 2: Проверяем сессию
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      testResults.session = { session, error: sessionError }

      // Тест 3: Проверяем shipping_methods
      const { data: shippingData, error: shippingError } = await supabase
        .from('shipping_methods')
        .select('*')
        .limit(5)
      testResults.shipping_methods = { data: shippingData, error: shippingError, count: shippingData?.length || 0 }

      // Тест 4: Проверяем products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(5)
      testResults.products = { data: productsData, error: productsError, count: productsData?.length || 0 }

      // Тест 5: Проверяем categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .limit(5)
      testResults.categories = { data: categoriesData, error: categoriesError, count: categoriesData?.length || 0 }

      // Тест 6: Проверяем users (только для админов)
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(5)
      testResults.users = { data: usersData, error: usersError, count: usersData?.length || 0 }

      // Тест 7: Проверяем cart_items
      const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('*')
        .limit(5)
      testResults.cart_items = { data: cartData, error: cartError, count: cartData?.length || 0 }

    } catch (error) {
      testResults.generalError = error
    }

    setResults(testResults)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">RLS Debug</h1>
        
        {/* User Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current User:</h2>
          <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        {/* Test Button */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button
            onClick={testRLS}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test RLS Access'}
          </button>
        </div>

        {/* Results */}
        {Object.keys(results).length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
            
            {Object.entries(results).map(([key, value]: [string, any]) => (
              <div key={key} className="mb-6 border-b pb-4">
                <h3 className="font-semibold text-lg mb-2">{key}:</h3>
                
                {value.error ? (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-red-800 font-medium">Error:</p>
                    <p className="text-red-600 text-sm">{value.error.message || value.error}</p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-green-800 font-medium">Success:</p>
                    <p className="text-green-600 text-sm">
                      {value.count !== undefined ? `Found ${value.count} records` : 'No data returned'}
                    </p>
                    {value.data && value.data.length > 0 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-green-700">Show data</summary>
                        <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                          {JSON.stringify(value.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
          <div className="space-y-2 text-sm">
            <p>1. Click "Test RLS Access" to check database access</p>
            <p>2. Green = Success, Red = Error (RLS blocked)</p>
            <p>3. If all tests fail, RLS policies are too restrictive</p>
            <p>4. Check Supabase Dashboard → Authentication → Policies</p>
          </div>
        </div>
      </div>
    </div>
  )
} 