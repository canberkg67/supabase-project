'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function AdminReply({ ticketId }) {
  const [reply, setReply] = useState('')

  const sendReply = async () => {
    await supabase.from('replies').insert({
      ticket_id: ticketId,
      message: reply,
    })
    setReply('')
  }

  return (
    <div className="mt-2">
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Admin cevabı"
      />
      <Button size="sm" onClick={sendReply}>
        Cevapla
      </Button>
    </div>
  )
}
