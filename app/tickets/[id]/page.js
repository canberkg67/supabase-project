'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id

  const [ticket, setTicket] = useState(null)
  const [replies, setReplies] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTicketAndReplies()
    getCurrentUser()
  }, [ticketId])

  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setCurrentUser(user)
  }

  const loadTicketAndReplies = async () => {
    setLoading(true)

    // Fetch ticket
    const { data: ticketData, error: ticketError } = await supabase
      .from('Ticket')
      .select('*')
      .eq('id', ticketId)
      .single()

    if (ticketError) {
      console.error('Failed to load ticket:', ticketError)
      setLoading(false)
      return
    }

    setTicket(ticketData)

    // Fetch replies with author details
    const { data: repliesData, error: repliesError } = await supabase
      .from('Reply')
      .select(`
        id,
        message,
        createdAt,
        authorId,
        author:authorId (
          id,
          email,
          profile (
            id,
            fullName,
            avatarUrl
          )
        )
      `)
      .eq('ticketId', ticketId)
      .order('createdAt', { ascending: true })

    if (!repliesError) {
      setReplies(repliesData || [])
    }

    setLoading(false)
  }

  const sendReply = async () => {
    if (!replyText.trim() || !currentUser) return

    const { error } = await supabase.from('Reply').insert({
      ticketId,
      message: replyText,
      authorId: currentUser.id,
    })

    if (error) {
      console.error('Reply error:', error)
      alert(error.message)
      return
    }

    setReplyText('')
    loadTicketAndReplies()
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto py-10">Loading...</div>
  }

  if (!ticket) {
    return <div className="max-w-3xl mx-auto py-10">Ticket not found</div>
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      {/* Geri Gitme Butonu */}
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:underline mb-6"
      >
        ← Geri Dön
      </button>

      {/* Ticket Detayları */}
      <div className="border rounded p-6 mb-8 bg-blue-50">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{ticket.title}</h1>
          <span
            className={`text-sm px-3 py-1 rounded font-semibold ${
              ticket.status === 'OPEN'
                ? 'bg-yellow-100 text-yellow-800'
                : ticket.status === 'ANSWERED'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
            }`}
          >
            {ticket.status}
          </span>
        </div>
        <p className="text-gray-700 whitespace-pre-wrap mb-4">{ticket.message}</p>
        <p className="text-sm text-muted-foreground">
          {new Date(ticket.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Cevaplar Bölümü */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Cevaplar ({replies.length})</h2>

        {replies.length === 0 ? (
          <p className="text-muted-foreground">Henüz cevap yok.</p>
        ) : (
          <div className="space-y-4 mb-6">
            {replies.map((reply) => (
              <div key={reply.id} className="border rounded p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">
                      {reply.author?.profile?.fullName || reply.author?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(reply.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Form */}
      <div className="border rounded p-6">
        <h3 className="text-lg font-semibold mb-4">Cevap Yaz</h3>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Cevabınızı yazın..."
          className="w-full border rounded p-3 mb-4 min-h-32"
        />
        <Button onClick={sendReply} disabled={!replyText.trim()}>
          Cevapla
        </Button>
      </div>
    </div>
  )
}
