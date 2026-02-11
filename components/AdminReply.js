'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function AdminReply({ ticketId }) {
  const [reply, setReply] = useState('')

  const sendReply = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase.from('replies').insert({
      ticketId,
      message: reply,
      authorId: user?.id,
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
