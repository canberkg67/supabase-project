'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function TicketList({ isAdmin }) {
  const [tickets, setTickets] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [replyCounts, setReplyCounts] = useState({})

  const getStatusLabel = (status) => {
    const labels = {
      OPEN: 'AÇIK',
      ANSWERED: 'CEVAPLANDI',
      CLOSED: 'KAPATILDI',
    }
    return labels[status] || status
  }

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

    // Load reply counts
    if (data && data.length > 0) {
      const ticketIds = data.map((t) => t.id)
      const { data: repliesData } = await supabase
        .from('Reply')
        .select('ticketId')
        .in('ticketId', ticketIds)

      const counts = {}
      repliesData?.forEach((reply) => {
        counts[reply.ticketId] = (counts[reply.ticketId] || 0) + 1
      })
      setReplyCounts(counts)
    }
  }, [isAdmin])

  useEffect(() => {
    loadTickets()
  }, [isAdmin, refreshTrigger, loadTickets])

  const deleteTicket = async (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    const { error } = await supabase.from('Ticket').delete().eq('id', id)
    if (error) {
      console.error('Ticket delete error:', error)
      alert('Silme hatası: ' + error.message)
      return
    }
    setRefreshTrigger((s) => s + 1)
  }

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
              <div className="flex gap-2">
                {replyCounts[t.id] > 0 && (
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 font-semibold">
                    CEVAP ({replyCounts[t.id]})
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    t.status === 'OPEN'
                      ? 'bg-yellow-100 text-yellow-800'
                      : t.status === 'ANSWERED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {getStatusLabel(t.status)}
                </span>
                {isAdmin && (
                  <button
                    onClick={(e) => deleteTicket(e, t.id)}
                    className="text-xs px-2 py-1 rounded bg-red-600 text-white font-semibold ml-2"
                  >
                    SİL
                  </button>
                )}
              </div>
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
