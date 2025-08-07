'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugOAuth() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testGoogleOAuth = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log('Testing Google OAuth...')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true, // Не перенаправляем сразу
        },
      })

      if (error) {
        setResult({ error: error.message, data: null })
        return
      }

      setResult({ error: null, data })
      
      // Если есть URL, показываем его
      if (data.url) {
        console.log('OAuth URL:', data.url)
        // Можно открыть в новом окне для тестирования
        // window.open(data.url, '_blank')
      }

    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error', data: null })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">OAuth Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Google OAuth Test</h2>
          
          <button
            onClick={testGoogleOAuth}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Google OAuth'}
          </button>

          {result && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>SUPABASE_URL:</span>
              <span className="font-mono text-sm">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>SUPABASE_ANON_KEY:</span>
              <span className="font-mono text-sm">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Current URL:</span>
              <span className="font-mono text-sm">
                {typeof window !== 'undefined' ? window.location.origin : 'Server side'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          
          <div className="space-y-2 text-sm">
            <p>1. Click "Test Google OAuth" to see if OAuth URL is generated</p>
            <p>2. If URL is generated, copy it and open in new tab</p>
            <p>3. Check if Google OAuth page appears</p>
            <p>4. If not, check Supabase Dashboard → Authentication → Providers → Google</p>
          </div>
        </div>
      </div>
    </div>
  )
} 