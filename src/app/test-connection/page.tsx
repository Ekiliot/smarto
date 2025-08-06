'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'

export default function TestConnectionPage() {
  const [testResults, setTestResults] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const runTests = async () => {
      const results: any = {}

      // Test 1: Environment variables
      results.envVars = {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        nodeEnv: process.env.NODE_ENV
      }

      // Test 2: Supabase connection
      try {
        const { data, error } = await supabase.from('categories').select('count').limit(1)
        results.supabaseConnection = {
          success: !error,
          error: error?.message,
          data: data
        }
      } catch (err) {
        results.supabaseConnection = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }
      }

      // Test 3: Shipping methods
      try {
        const { data, error } = await supabase.from('shipping_methods').select('*').eq('is_active', true)
        results.shippingMethods = {
          success: !error,
          error: error?.message,
          count: data?.length || 0,
          data: data
        }
      } catch (err) {
        results.shippingMethods = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }
      }

      // Test 4: Products
      try {
        const { data, error } = await supabase.from('products').select('*').limit(5)
        results.products = {
          success: !error,
          error: error?.message,
          count: data?.length || 0,
          data: data
        }
      } catch (err) {
        results.products = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }
      }

      // Test 5: API routes
      try {
        const categoriesResponse = await fetch('/api/categories')
        results.apiCategories = {
          success: categoriesResponse.ok,
          status: categoriesResponse.status,
          data: await categoriesResponse.json()
        }
      } catch (err) {
        results.apiCategories = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }
      }

      try {
        const shippingResponse = await fetch('/api/shipping')
        results.apiShipping = {
          success: shippingResponse.ok,
          status: shippingResponse.status,
          data: await shippingResponse.json()
        }
      } catch (err) {
        results.apiShipping = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }
      }

      setTestResults(results)
      setIsLoading(false)
    }

    runTests()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Se testează conexiunea...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Hidden on mobile */}
      <div className="hidden md:block">
        <Header />
      </div>
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Conexiune</h1>
          
          <div className="space-y-6">
            {/* Environment Variables */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Variabile de mediu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-3 rounded ${testResults.envVars?.supabaseUrl ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <strong>SUPABASE_URL:</strong> {testResults.envVars?.supabaseUrl ? '✅ Setat' : '❌ Lipsă'}
                </div>
                <div className={`p-3 rounded ${testResults.envVars?.supabaseKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <strong>SUPABASE_KEY:</strong> {testResults.envVars?.supabaseKey ? '✅ Setat' : '❌ Lipsă'}
                </div>
                <div className="p-3 rounded bg-blue-100 text-blue-800">
                  <strong>NODE_ENV:</strong> {testResults.envVars?.nodeEnv}
                </div>
              </div>
            </div>

            {/* Supabase Connection */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Conexiune Supabase</h2>
              <div className={`p-3 rounded ${testResults.supabaseConnection?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <strong>Status:</strong> {testResults.supabaseConnection?.success ? '✅ Conectat' : '❌ Eroare'}
                {testResults.supabaseConnection?.error && (
                  <div className="mt-2 text-sm">
                    <strong>Eroare:</strong> {testResults.supabaseConnection.error}
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Methods */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Metode de livrare</h2>
              <div className={`p-3 rounded ${testResults.shippingMethods?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <strong>Status:</strong> {testResults.shippingMethods?.success ? '✅ Găsite' : '❌ Eroare'}
                <div className="mt-2">
                  <strong>Număr:</strong> {testResults.shippingMethods?.count || 0} metode
                </div>
                {testResults.shippingMethods?.error && (
                  <div className="mt-2 text-sm">
                    <strong>Eroare:</strong> {testResults.shippingMethods.error}
                  </div>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Produse</h2>
              <div className={`p-3 rounded ${testResults.products?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <strong>Status:</strong> {testResults.products?.success ? '✅ Găsite' : '❌ Eroare'}
                <div className="mt-2">
                  <strong>Număr:</strong> {testResults.products?.count || 0} produse
                </div>
                {testResults.products?.error && (
                  <div className="mt-2 text-sm">
                    <strong>Eroare:</strong> {testResults.products.error}
                  </div>
                )}
              </div>
            </div>

            {/* API Routes */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">API Routes</h2>
              <div className="space-y-3">
                <div className={`p-3 rounded ${testResults.apiCategories?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <strong>/api/categories:</strong> {testResults.apiCategories?.success ? '✅ Funcționează' : '❌ Eroare'}
                  {testResults.apiCategories?.error && (
                    <div className="mt-1 text-sm">Eroare: {testResults.apiCategories.error}</div>
                  )}
                </div>
                <div className={`p-3 rounded ${testResults.apiShipping?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <strong>/api/shipping:</strong> {testResults.apiShipping?.success ? '✅ Funcționează' : '❌ Eroare'}
                  {testResults.apiShipping?.error && (
                    <div className="mt-1 text-sm">Eroare: {testResults.apiShipping.error}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Hidden on mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
} 