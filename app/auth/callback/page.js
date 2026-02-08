'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { syncUser } from '@/app/actions/sync'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash with tokens
        const hash = window.location.hash

        if (!hash) {
          console.log('❌ No hash found in URL')
          router.push('/')
          return
        }

        console.log('🔄 Processing OAuth callback...')

        // Exchange the hash for a session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(hash)

        if (exchangeError) {
          console.error('❌ Exchange error:', exchangeError)
          router.push('/?error=exchange_failed')
          return
        }

        // Get the user from session
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          console.error('❌ User error:', userError)
          router.push('/?error=user_failed')
          return
        }

        console.log('👤 User:', user.id, user.email)

        // Sync to database
        const syncResult = await syncUser({
          id: user.id,
          email: user.email,
          metadata: user.user_metadata,
        })

        console.log('✅ Sync result:', syncResult)
        router.push('/')
      } catch (err) {
        console.error('❌ Callback error:', err)
        router.push('/?error=unknown')
      }
    }

    handleCallback()
  }, [router])

  return <p>Giriş yapılıyor...</p>
}
