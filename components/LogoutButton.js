'use client'

import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <Button variant="outline" onClick={logout}>
      Çıkış Yap
    </Button>
  )
}
