'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import AdminReply from './AdminReply'

export default function TicketList({ isAdmin }) {
  const [tickets, setTickets] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const loadTickets = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let query = supabase.from('Ticket').select('*')

    if (!isAdmin) {
      if (!user) {
        console.warn('TicketList: no user available')
        setTickets([])
        return
      }
      query = query.eq('userId', user.id)
    }

    const { data, error } = await query.order('createdAt', { ascending: false })
    console.log('load tickets:', data, error)
    if (error) {
      console.error('Ticket load error:', error)
      setTickets([])
      return
    }

    setTickets(data || [])
  }, [isAdmin])

  useEffect(() => {
    loadTickets()
  }, [isAdmin, refreshTrigger, loadTickets])

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
