'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { syncUser } from '@/app/actions/sync'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      
      const { data: sessionData, error } =
        await supabase.auth.getSession()

      if (error) {
        console.error('Session error:', error)
        router.replace('/')
        return
      }

      const user = sessionData?.session?.user

      if (user) {
        await syncUser({
          id: user.id,
          email: user.email,
          metadata: user.user_metadata,
        })
      }

      
      router.replace('/')
    }

    run()
  }, [router])

  return <p>Giriş yapılıyor...</p>
}
