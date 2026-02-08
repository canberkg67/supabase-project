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
        console.log('🔄 Processing OAuth callback...')

        // Get the session (Supabase SDK already exchanged the code)
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('❌ Session error:', error)
          router.push('/')
          return
        }

        if (!session?.user) {
          console.log('❌ No user in session')
          router.push('/')
          return
        }

        const user = session.user
        console.log('👤 User:', user.id, user.email)

        // Sync to database
        const syncResult = await syncUser({
          id: user.id,
          email: user.email,
          metadata: user.user_metadata,
        })

        console.log('✅ User synced to database:', syncResult?.id)
        router.push('/')
      } catch (err) {
        console.error('❌ Callback error:', err)
        router.push('/')
      }
    }

    handleCallback()
  }, [router])

  return <p>Giriş yapılıyor...</p>
}
