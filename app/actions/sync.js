import { prisma } from '@/lib/prisma'

export async function syncUser(user) {
  if (!user?.email) return null

  return prisma.user.upsert({
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
    },
  })
}
