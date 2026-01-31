'use client'

import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function Home() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error(error)
      alert(error.message)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Button onClick={signInWithGoogle}>
        Google ile giriş yap
      </Button>
    </main>
  )
}
