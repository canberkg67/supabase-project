'use client'

import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogIn } from "lucide-react"
import Image from 'next/image'

export default function Home() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error(error)
      alert(error.message)
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-20">
      {/* HERO KISMI */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Gerçek Zamanlı Destek Sistemi
          </h1>

          <p className="mt-4 text-muted-foreground text-lg">
            Nextjs,Supabase Auth ve Prisma kullanılarak
            geliştirilmiş bir demodur.
            Kullanıcılar bir sorusunu veya şikayetini bildirmek için ticket açabilir, adminler de anında yanıtlayabilir.
          </p>

          <div className="mt-8">
            <Button size="lg" onClick={signInWithGoogle}>
              <LogIn className="mr-2 h-5 w-5" />
              Google ile Giriş Yap
            </Button>
          </div>
        </div>

        {/* RESİM */}
        <div className="relative w-full h-[320px]">
          <Image
            src="/ticket-answer.avif"
            alt="Bir Ofis Destek Masası"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* FEATURES KISMI */}
      <section className="mt-24 grid md:grid-cols-3 gap-8">
        <Feature
          title="Ticket Açma"
          text="Kullanıcılar destek taleplerini kolayca oluşturur."
        />
        <Feature
          title="Realtime Cevap"
          text="Problemi çözmek için anlık mesajlaşma ile müşteri ile kolayca iletişim."
        />
      </section>
    </main>
  )
}

function Feature({ title, text }) {
  return (
    <div className="border rounded-xl p-6">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
