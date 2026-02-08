'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { syncUser } from '@/app/actions/sync'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      try {
        // First, exchange the code for a session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(location.hash)
        console.log('🔄 Exchange result:', data, exchangeError)

        if (exchangeError) {
          console.error('❌ Exchange error:', exchangeError)
          router.replace('/')
          return
        }

        // Now get the session
        const { data: sessionData, error } =
          await supabase.auth.getSession()

        if (error) {
          console.error('❌ Session error:', error)
          router.replace('/')
          return
        }

        const user = sessionData?.session?.user
        console.log('👤 User from session:', user?.id, user?.email)

        if (user) {
          const syncResult = await syncUser({
            id: user.id,
            email: user.email,
            metadata: user.user_metadata,
          })
          console.log('✅ Sync result:', syncResult)
        } else {
          console.log('❌ No user found in session')
        }

        router.replace('/')
      } catch (err) {
        console.error('❌ Callback error:', err)
        router.replace('/')
      }
    }

    run()
  }, [router])

  return <p>Giriş yapılıyor...</p>
}
