import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {Button} from '@/components//ui/button'

export default function TicketForm() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  const createTicket = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase.from('tickets').insert({
      user_id: user.id,
      title,
      message,
    })

    setTitle('')
    setMessage('')
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
