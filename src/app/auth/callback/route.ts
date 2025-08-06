import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const userAgent = request.headers.get('user-agent') || ''
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent)

  if (code) {
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
                secure: true,
                sameSite: 'lax' as const,
                httpOnly: false, // Разрешаем доступ из JavaScript для мобильных устройств
                maxAge: 60 * 60 * 24 * 7, // 7 дней
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
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        // Redirect to auth error page
        return NextResponse.redirect(new URL('/auth/error?error=auth_failed', request.url))
      }

      // Проверяем, что сессия создана успешно
      if (!data.session) {
        console.error('No session created after code exchange')
        return NextResponse.redirect(new URL('/auth/error?error=no_session', request.url))
      }

      console.log('Session created successfully for user:', data.user?.email)
    } catch (error) {
      console.error('Unexpected error during auth callback:', error)
      return NextResponse.redirect(new URL('/auth/error?error=unexpected', request.url))
    }
  }

  // URL to redirect to after sign in process completes
  // Для мобильных устройств используем более простой редирект
  const redirectUrl = isMobile 
    ? new URL('/account', request.url)
    : new URL(`/account?code=${code}`, request.url)
    
  return NextResponse.redirect(redirectUrl)
} 