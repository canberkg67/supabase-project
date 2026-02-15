'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

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

  const truncateMessage = (message, length = 100) => {
    return message.length > length ? message.substring(0, length) + '...' : message
  }

  return (
    <div className="space-y-2">
      {tickets.map((t) => (
        <Link key={t.id} href={`/tickets/${t.id}`}>
          <div className="border p-4 rounded hover:bg-gray-50 cursor-pointer transition">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{t.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {truncateMessage(t.message)}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${t.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' : t.status === 'ANSWERED' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                {t.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(t.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
