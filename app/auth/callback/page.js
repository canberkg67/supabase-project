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
        
        const { data: { session }, error } =
          await supabase.auth.getSession()

        if (error || !session?.user) {
          router.replace('/')
          return
        }

        const user = session.user

        await syncUser({
          id: user.id,
          email: user.email,
          metadata: user.user_metadata,
        })

        // BAŞARILI GİRİŞTEN SONRA TICKET SAYFASINA YÖNLENDİRME:
        router.replace('/tickets')

      } catch (err) {
        console.error(err)
        router.replace('/')
      }
    }

    handleCallback()
  }, [router])

  return <p>Giriş yapılıyor...</p>
}
