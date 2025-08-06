import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const userAgent = request.headers.get('user-agent') || ''
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent)

  console.log('Auth callback received:', { code: !!code, error, isMobile, userAgent })

  // Если есть ошибка, перенаправляем на страницу ошибки
  if (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL(`/auth/error?error=${error}`, request.url))
  }

  if (!code) {
    console.error('No code provided in auth callback')
    return NextResponse.redirect(new URL('/auth/error?error=no_code', request.url))
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
            // Улучшенные настройки cookies для мобильных устройств
            const cookieOptions = {
              ...options,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax' as const,
              httpOnly: false, // Разрешаем доступ из JavaScript для мобильных устройств
              maxAge: 60 * 60 * 24 * 7, // 7 дней
              path: '/'
            }
            cookieStore.set({ name, value, ...cookieOptions })
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
    console.log('Exchanging code for session...')
    
    // Exchange the code for a session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      return NextResponse.redirect(new URL(`/auth/error?error=exchange_failed&details=${exchangeError.message}`, request.url))
    }

    // Проверяем, что сессия создана успешно
    if (!data.session) {
      console.error('No session created after code exchange')
      return NextResponse.redirect(new URL('/auth/error?error=no_session', request.url))
    }

    console.log('Session created successfully for user:', data.user?.email)
    console.log('Session expires at:', data.session.expires_at)
    
  } catch (error) {
    console.error('Unexpected error during auth callback:', error)
    return NextResponse.redirect(new URL('/auth/error?error=unexpected', request.url))
  }

  // URL to redirect to after sign in process completes
  // Для мобильных устройств используем более простой редирект
  const redirectUrl = isMobile 
    ? new URL('/account', request.url)
    : new URL('/account', request.url)
    
  console.log('Redirecting to:', redirectUrl.toString())
  return NextResponse.redirect(redirectUrl)
} 