import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'

import TicketForm from '@/components/TicketForm'
import TicketList from '@/components/TicketList'
import AdminSwitch from '@/components/AdminSwitch'
import LogoutButton from '@/components/LogoutButton'

export default async function TicketsPage() {
  const supabase = createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Giriş Yapılmamışsa ana sayfaya yönlendir
  if (!user) {
    redirect('/')
  }

  // Kullanıcının rolünü veritabanından kontrol et
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  })

  const isAdmin = dbUser?.role === 'ADMIN'

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ticket Paneli</h1>
        <LogoutButton />
      </div>

      {isAdmin && <AdminSwitch />}

      <TicketForm />
      <TicketList isAdmin={isAdmin} />
    </div>
  )
}
