'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from cookies (PKCE flow)
        const { data, error } = await supabase.auth.getSession()

        if (error || !data?.session) {
          console.error('Auth error:', error)
          router.push('/')
          return
        }

        const user = data.session.user

        // Sync user to database
        console.log('Syncing user to database:', user.id)
        const response = await fetch('/api/auth/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: user.id,
            email: user.email,
            metadata: user.user_metadata,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to sync user')
        }

        // Redirect to tickets after successful sync
        console.log('Session established and user synced:', user.id)
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
