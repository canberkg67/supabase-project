'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {Button} from '@/components//ui/button'

export default function TicketForm({ onTicketCreated }) {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  const createTicket = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: insertData, error: insertError } = await supabase
      .from('Ticket')
      .insert({
        userId: user.id,
        title,
        message,
      })

    console.log('createTicket:', insertData, insertError)

    if (insertError) {
      console.error('Ticket insert error:', insertError)
      alert(insertError.message)
      return
    }

    setTitle('')
    setMessage('')
    
    // Notify parent to refresh ticket list
    if (onTicketCreated) {
      onTicketCreated()
    }
  }

  return (
    <div className="border p-4 rounded mb-6">
      <input
        className="w-full mb-2"
        placeholder="Başlık"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full mb-2"
        placeholder="Mesaj"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={createTicket}>Gönder</Button>
    </div>
  )
}
