'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function TicketsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace('/')
      } else {
        setUser(data.user)

        // Basit admin kontrolü
        if (data.user.email === 'canberk.girgin67@gmail.com') {
          setIsAdmin(true)
        }
      }
    })
  }, [router])

  const logout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  if (!user) return <p>Yükleniyor...</p>

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ticket Paneli</h1>

        <Button variant="outline" onClick={logout}>
          Çıkış Yap
        </Button>
      </div>

      {isAdmin && <AdminSwitch />}

      <TicketForm />
      <TicketList isAdmin={isAdmin} />
    </div>
  )
}
