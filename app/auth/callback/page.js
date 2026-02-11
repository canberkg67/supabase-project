'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // hash den session bilgilerini al
        const { data, error } = await supabase.auth.getSession()

        if (error || !data?.session) {
          console.error('Auth error:', error)
          router.push('/')
          return
        }

        //session bilgileri alındıktan sonra kullanıcıyı ticket paneline yönlendir
        console.log('Session established:', data.session.user.id)
        router.push('/tickets')
      } catch (err) {
        console.error('Callback error:', err)
        router.push('/')
      }
    }

    
    handleAuthCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Authenticating...</p>
    </div>
  )
}
