'use client'

import { useEffect } from 'react'
import { syncUser } from '@/app/actions/sync'
import { useRouter } from 'next/navigation'

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
