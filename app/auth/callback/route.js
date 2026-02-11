import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { syncUser } from '@/app/actions/sync'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createSupabaseServerClient()

    const { data, error } =
      await supabase.auth.exchangeCodeForSession(code)

    if (!error && data?.user) {
      await syncUser({
        id: data.user.id,
        email: data.user.email,
        metadata: data.user.user_metadata,
      })
    }
  }

  return NextResponse.redirect(new URL('/tickets', request.url))
}
