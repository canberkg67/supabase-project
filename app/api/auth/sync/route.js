import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const userData = await request.json()

    if (!userData?.id || !userData?.email) {
      return NextResponse.json(
        { error: 'Missing user data' },
        { status: 400 }
      )
    }

    // Sync user to database
    const user = await prisma.user.upsert({
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
          update: {
            fullName:
              userData.metadata?.full_name ||
              userData.metadata?.name ||
              null,
            avatarUrl: userData.metadata?.avatar_url || null,
          },
        },
      },
    })

    console.log('✅ User synced:', user.id)
    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
