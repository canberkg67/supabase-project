'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { syncUser } from '@/app/actions/sync'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      await syncUser()
      router.replace('/')
    }

    run()
  }, [router])

  return <p>Giriş yapılıyor...</p>
}
