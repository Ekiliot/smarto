'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  CheckCircle,
  XCircle,
  Loader2,
  Database,
  User,
  ShoppingCart,
  Package
} from 'lucide-react'

interface TestResult {
  name: string
  success: boolean
  message: string
  data?: any
}

export default function TestConnectionPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [overallStatus, setOverallStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    runTests()
  }, [])

  const runTests = async () => {
    const testResults: TestResult[] = []
    
    try {
      // Test 1: Basic Supabase connection
      logger.info('Testing basic Supabase connection...')
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      testResults.push({
        name: 'Supabase Connection',
        success: !authError,
        message: authError ? `Connection failed: ${authError.message}` : 'Connected successfully',
        data: { hasSession: !!session }
      })

      // Test 2: Products table access
      logger.info('Testing products table access...')
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, title')
        .limit(1)

      testResults.push({
        name: 'Products Table',
        success: !productsError,
        message: productsError ? `Access failed: ${productsError.message}` : `Found ${products?.length || 0} products`,
        data: products
      })

      // Test 3: Categories table access
      logger.info('Testing categories table access...')
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        .limit(1)

      testResults.push({
        name: 'Categories Table',
        success: !categoriesError,
        message: categoriesError ? `Access failed: ${categoriesError.message}` : `Found ${categories?.length || 0} categories`,
        data: categories
      })

      // Test 4: Users table access (if authenticated)
      if (session?.user) {
        logger.info('Testing users table access...')
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, email, role')
          .eq('id', session.user.id)
          .limit(1)

        testResults.push({
          name: 'Users Table',
          success: !usersError,
          message: usersError ? `Access failed: ${usersError.message}` : `User found: ${users?.[0]?.email}`,
          data: users?.[0]
        })
      } else {
        testResults.push({
          name: 'Users Table',
          success: true,
          message: 'Skipped - not authenticated',
          data: null
        })
      }

      // Test 5: Cart table access (if authenticated)
      if (session?.user) {
        logger.info('Testing cart table access...')
        const { data: cart, error: cartError } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('user_id', session.user.id)
          .limit(1)

        testResults.push({
          name: 'Cart Table',
          success: !cartError,
          message: cartError ? `Access failed: ${cartError.message}` : `Found ${cart?.length || 0} cart items`,
          data: cart
        })
      } else {
        testResults.push({
          name: 'Cart Table',
          success: true,
          message: 'Skipped - not authenticated',
          data: null
        })
      }

      // Test 6: Shipping methods table access
      logger.info('Testing shipping methods table access...')
      const { data: shipping, error: shippingError } = await supabase
        .from('shipping_methods')
        .select('id, name, is_active')
        .limit(1)

      testResults.push({
        name: 'Shipping Methods',
        success: !shippingError,
        message: shippingError ? `Access failed: ${shippingError.message}` : `Found ${shipping?.length || 0} shipping methods`,
        data: shipping
      })

      // Test 7: Payment methods table access
      logger.info('Testing payment methods table access...')
      const { data: payments, error: paymentsError } = await supabase
        .from('payment_methods')
        .select('id, name, is_active')
        .limit(1)

      testResults.push({
        name: 'Payment Methods',
        success: !paymentsError,
        message: paymentsError ? `Access failed: ${paymentsError.message}` : `Found ${payments?.length || 0} payment methods`,
        data: payments
      })

      // Test 8: Environment variables
      testResults.push({
        name: 'Environment Variables',
        success: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        message: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) 
          ? 'All required variables are set' 
          : 'Missing required environment variables',
        data: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      })

    } catch (error) {
      logger.error('Test execution error:', error)
      testResults.push({
        name: 'Test Execution',
        success: false,
        message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: error
      })
    }

    setResults(testResults)
    setIsLoading(false)
    
    // Determine overall status
    const hasErrors = testResults.some(result => !result.success)
    setOverallStatus(hasErrors ? 'error' : 'success')
  }

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    )
  }

  const getStatusColor = (success: boolean) => {
    return success 
      ? 'border-green-200 bg-green-50' 
      : 'border-red-200 bg-red-50'
  }

  const getStatusTextColor = (success: boolean) => {
    return success 
      ? 'text-green-800' 
      : 'text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Database className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test de Conectare Supabase
          </h1>
          <p className="text-gray-600">
            Verificarea conectării și accesului la baza de date
          </p>
        </div>

        {/* Overall Status */}
        {!isLoading && (
          <div className={`mb-8 p-6 rounded-lg border ${
            overallStatus === 'success' 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center justify-center space-x-2">
              {overallStatus === 'success' ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              <span className={`text-lg font-medium ${
                overallStatus === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {overallStatus === 'success' 
                  ? 'Toate testele au trecut cu succes!' 
                  : 'Unele teste au eșuat'
                }
              </span>
            </div>
          </div>
        )}

        {/* Test Results */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Se execută testele...</p>
            </div>
          ) : (
            results.map((result, index) => (
              <div 
                key={index}
                className={`p-6 rounded-lg border ${getStatusColor(result.success)}`}
              >
                <div className="flex items-start space-x-3">
                  {getStatusIcon(result.success)}
                  <div className="flex-1">
                    <h3 className={`font-medium ${getStatusTextColor(result.success)}`}>
                      {result.name}
                    </h3>
                    <p className={`text-sm mt-1 ${getStatusTextColor(result.success)}`}>
                      {result.message}
                    </p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer">
                          Vezi detalii
                        </summary>
                        <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        {!isLoading && (
          <div className="mt-8 text-center space-x-4">
            <button
              onClick={runTests}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Rulează din nou testele
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors inline-block"
            >
              Înapoi la pagina principală
            </a>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
} 