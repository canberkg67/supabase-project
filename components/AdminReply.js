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

    if (!user) {
      alert('Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.')
      return
    }

    const { data: insertData, error: insertError } = await supabase
      .from('Reply')
      .insert({
        ticketId,
        message: reply,
        authorId: user.id,
      })

    console.log('sendReply:', insertData, insertError)
    if (insertError) {
      console.error('Reply insert error:', insertError)
      alert(insertError.message)
      return
    }

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
