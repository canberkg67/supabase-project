'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error(error)
        return
      }

      // Session başarılı → anasayfaya dön
      router.replace('/')
    }

    getSession()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      Giriş yapılıyor...
    </div>
  )
}
