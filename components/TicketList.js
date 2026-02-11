'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import AdminReply from './AdminReply'

export default function TicketList({ isAdmin }) {
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      let query = supabase.from('Ticket').select('*')

      if (!isAdmin) {
        query = query.eq('userId', user.id)
      }

      const { data } = await query.order('createdAt', { ascending: false })
      setTickets(data || [])
    }

    load()
  }, [isAdmin])

  return (
    <div className="space-y-4">
      {tickets.map((t) => (
        <div key={t.id} className="border p-3 rounded">
          <h3 className="font-semibold">{t.title}</h3>
          <p className="text-sm text-muted-foreground">{t.message}</p>

          {isAdmin && <AdminReply ticketId={t.id} />}
        </div>
      ))}
    </div>
  )
}
