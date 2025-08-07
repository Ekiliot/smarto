import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { CookieOptions } from '@/types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({
            ...options,
            name,
            value,
          })
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({
            ...options,
            name,
            value: '',
          })
        },
      },
    }
  )

  try {
    // Refresh session if expired - required for Server Components
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Middleware session error:', error)
    }

    // Security headers
    res.headers.set('X-Content-Type-Options', 'nosniff')
    res.headers.set('X-Frame-Options', 'DENY')
    res.headers.set('X-XSS-Protection', '1; mode=block')
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    // Cache control for better performance
    if (req.nextUrl.pathname.startsWith('/api/')) {
      res.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      res.headers.set('Pragma', 'no-cache')
      res.headers.set('Expires', '0')
    } else {
      res.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400')
    }
    
  } catch (error) {
    console.error('Middleware error:', error)
  }

  return res
} 