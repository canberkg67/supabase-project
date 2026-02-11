import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { syncUser } from '@/app/actions/sync'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // Supabase auth callback'ında hata varsa ana sayfaya yönlendir
  if (error) {
    console.error('Auth error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (code) {
    try {
      const supabase = await createSupabaseServerClient()

      const { data, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error('Session exchange error:', exchangeError)
        return NextResponse.redirect(new URL('/', request.url))
      }

      if (data?.user) {
        await syncUser({
          id: data.user.id,
          email: data.user.email,
          metadata: data.user.user_metadata,
        })
        
        // ticket paneline yönlendir
        return NextResponse.redirect(new URL('/tickets', request.url))
      }
    } catch (err) {
      console.error('Callback error:', err)
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  
  return NextResponse.redirect(new URL('/', request.url))
}
