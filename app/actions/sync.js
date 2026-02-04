import { createSupabaseServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function syncUser() {
  const supabase = createSupabaseServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user || !user.email) {
    return null
  }

  const syncedUser = await prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email,
      role: 'USER',
      profile: {
        create: {
          fullName:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            null,
          avatarUrl: user.user_metadata?.avatar_url || null,
        },
      },
    },
    update: {
      email: user.email,
      profile: {
        upsert: {
          where: { userId: user.id },
          create: {
            fullName:
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              null,
            avatarUrl: user.user_metadata?.avatar_url || null,
          },
          update: {
            fullName:
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              null,
            avatarUrl: user.user_metadata?.avatar_url || null,
          },
        },
      },
    },
  })

  return syncedUser
}