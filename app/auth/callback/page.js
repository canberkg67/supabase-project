'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function AuthCallbackPage({ searchParams }) {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const code = searchParams?.code

  if (code) {
    console.log('🔄 Exchanging code for session...')
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('❌ Exchange error:', exchangeError)
      redirect('/?error=auth_failed')
    }

    // Get the user and sync to database
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('❌ User fetch error:', userError)
      redirect('/?error=user_fetch_failed')
    }

    console.log('👤 User:', user.id, user.email)

    // Sync user to database
    try {
      const syncResult = await prisma.user.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          email: user.email,
          role: 'USER',
          profile: {
            create: {
              fullName:
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                null,
              avatarUrl: user.user_metadata?.avatar_url || null,
            },
          },
        },
        update: {
          email: user.email,
          profile: {
            upsert: {
              where: { userId: user.id },
              create: {
                fullName:
                  user.user_metadata?.full_name ||
                  user.user_metadata?.name ||
                  null,
                avatarUrl: user.user_metadata?.avatar_url || null,
              },
              update: {
                fullName:
                  user.user_metadata?.full_name ||
                  user.user_metadata?.name ||
                  null,
                avatarUrl: user.user_metadata?.avatar_url || null,
              },
            },
          },
        },
      })
      console.log('✅ User synced:', user.id)
    } catch (dbError) {
      console.error('❌ Database error:', dbError)
      redirect('/?error=db_sync_failed')
    }
  }

  redirect('/')
}
