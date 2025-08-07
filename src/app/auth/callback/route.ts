import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  
  // Получаем fragment из URL (все что после #)
  const fragment = requestUrl.hash.substring(1) // Убираем #
  const fragmentParams = new URLSearchParams(fragment)
  const accessToken = fragmentParams.get('access_token')
  const refreshToken = fragmentParams.get('refresh_token')
  const expiresAt = fragmentParams.get('expires_at')

  console.log('Auth callback received:', { 
    code: !!code, 
    error, 
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken 
  })

  // Если есть ошибка, перенаправляем на страницу ошибки
  if (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL(`/auth/error?error=${error}`, request.url))
  }

  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error('Error setting cookie:', error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            console.error('Error removing cookie:', error)
          }
        },
      },
    }
  )
  
  try {
    // Если есть access_token в fragment (Magic Link), используем его
    if (accessToken && refreshToken) {
      console.log('Processing Magic Link tokens from fragment...')
      
      // Устанавливаем сессию вручную
      const { data, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (sessionError) {
        console.error('Error setting session from tokens:', sessionError)
        return NextResponse.redirect(new URL(`/auth/error?error=session_failed&details=${encodeURIComponent(sessionError.message)}`, request.url))
      }

      if (!data.session) {
        console.error('No session created from tokens')
        return NextResponse.redirect(new URL('/auth/error?error=no_session', request.url))
      }

      console.log('Session created successfully from Magic Link tokens for user:', data.user?.email)
    }
    // Если есть code (OAuth), обрабатываем его
    else if (code) {
      console.log('Exchanging OAuth code for session...')
      
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(new URL(`/auth/error?error=exchange_failed&details=${encodeURIComponent(exchangeError.message)}`, request.url))
      }

      if (!data.session) {
        console.error('No session created after code exchange')
        return NextResponse.redirect(new URL('/auth/error?error=no_session', request.url))
      }

      console.log('Session created successfully from OAuth code for user:', data.user?.email)
    }
    else {
      console.error('No code or tokens provided in auth callback')
      return NextResponse.redirect(new URL('/auth/error?error=no_code', request.url))
    }
    
  } catch (error) {
    console.error('Unexpected error during auth callback:', error)
    return NextResponse.redirect(new URL('/auth/error?error=unexpected', request.url))
  }

  // URL to redirect to after sign in process completes
  const redirectUrl = new URL('/account', request.url)
    
  console.log('Redirecting to:', redirectUrl.toString())
  return NextResponse.redirect(redirectUrl)
} 