import './globals.css'
import { SiteLogo } from '@/components/Sitelogo'

export const metadata = {
  title: 'Ticket Supabase',
  description: 'Supabase + Next.js + Prisma ticket sistemi',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col">
        <header className="border-b p-4">
          <nav className="max-w-5xl mx-auto flex justify-between">
            <SiteLogo />
            <span className="text-sm text-muted-foreground">
              Nextjs+Supabase
            </span>
          </nav>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t p-4 text-center text-sm text-muted-foreground">
          © 2026 Ticket Sistemi. Nextjs, Supabase ve Prisma ile geliştirildi.
        </footer>
      </body>
    </html>
  )
}
