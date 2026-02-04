'use server'

import { prisma } from '@/lib/prisma'

export async function syncUser(user) {
  if (!user?.id || !user?.email) return null

  return prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email,
      role: 'USER',
      profile: {
        create: {
          fullName:
            user.metadata?.full_name ||
            user.metadata?.name ||
            null,
          avatarUrl: user.metadata?.avatar_url || null,
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
              user.metadata?.full_name ||
              user.metadata?.name ||
              null,
            avatarUrl: user.metadata?.avatar_url || null,
          },
          update: {
            fullName:
              user.metadata?.full_name ||
              user.metadata?.name ||
              null,
            avatarUrl: user.metadata?.avatar_url || null,
          },
        },
      },
    },
  })
}
