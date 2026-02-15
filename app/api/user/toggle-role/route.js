import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Mevcut rolü al
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    const newRole = dbUser?.role === 'ADMIN' ? 'USER' : 'ADMIN'

    // Rolü güncelle
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: newRole },
      select: { role: true },
    })

    console.log(`✅ User ${user.id} role toggled to ${updatedUser.role}`)
    return NextResponse.json({ success: true, newRole: updatedUser.role })
  } catch (error) {
    console.error('Toggle role error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
