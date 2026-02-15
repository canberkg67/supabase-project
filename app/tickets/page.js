import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'

import TicketForm from '@/components/TicketForm'
import TicketList from '@/components/TicketList'
import AdminSwitch from '@/components/AdminSwitch'
import LogoutButton from '@/components/LogoutButton'

export default async function TicketsPage() {
  const supabase = await createSupabaseServerClient()

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
    <div className="max-w-3xl mx-auto py-10 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ticket Paneli</h1>
        <LogoutButton />
      </div>

      {isAdmin && <AdminSwitch />}

      {/* ADMIN SAYFASI */}
      {isAdmin ? (
        <>
          {/* TİCKET LİSTESİ*/}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Bütün Ticketlar</h2>
              <p className="text-sm text-muted-foreground">
                Bütün destek taleplerini buradan
                görüntüleyebilir ve yanıtlayabilirsiniz.
              </p>
            </div>

            <TicketList isAdmin={true} />
          </div>

          {/* TİCKET OLUŞTURMA */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Yeni Ticket Oluştur</h2>
              <p className="text-sm text-muted-foreground">
                Yeni bir destek talebi oluşturabilirsiniz.
              </p>
            </div>

            <TicketForm />
          </div>
        </>
      ) : (
        /* KULLANICI SAYFASI */
        <>
          {/* TİCKET FORMU */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Yeni Destek Talebi</h2>
              <p className="text-sm text-muted-foreground">
                Probleminizi yazarak bir destek talebi oluşturun.
              </p>
            </div>

            <TicketForm />
          </div>

          {/* TİCKET LİSTESİ */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">
                Ticketlarınız
              </h2>
              <p className="text-sm text-muted-foreground">
                Daha önce oluşturduğunuz destek taleplerini burada
                görüntüleyebilirsiniz.
              </p>
            </div>

            <TicketList isAdmin={false} />
          </div>
        </>
      )}
    </div>
  )
}
