'use server'

import { prisma } from '@/lib/prisma'

export async function syncUser(userData) {
  if (!userData?.id || !userData?.email) {
    console.log('❌ syncUser: user data missing', userData)
    return null
  }

  try {
    const result = await prisma.user.upsert({
      where: { id: userData.id },
      create: {
        id: userData.id,
        email: userData.email,
        role: 'USER',
        profile: {
          create: {
            fullName:
              userData.metadata?.full_name ||
              userData.metadata?.name ||
              null,
            avatarUrl: userData.metadata?.avatar_url || null,
          },
        },
      },
      update: {
        email: userData.email,
        profile: {
          upsert: {
            where: { userId: userData.id },
            create: {
              fullName:
                userData.metadata?.full_name ||
                userData.metadata?.name ||
                null,
              avatarUrl: userData.metadata?.avatar_url || null,
            },
            update: {
              fullName:
                userData.metadata?.full_name ||
                userData.metadata?.name ||
                null,
              avatarUrl: userData.metadata?.avatar_url || null,
            },
          },
        },
      },
    })
    console.log('✅ syncUser: user saved', userData.id)
    return result
  } catch (error) {
    console.error('❌ syncUser: database error', error)
    return null
  }
}
