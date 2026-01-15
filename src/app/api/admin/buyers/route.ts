import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()

    const orders = await prisma.order.findMany({
      where: { status: 'COMPLETED' },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        course: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const buyersMap = new Map<string, {
      id: string
      name: string
      email: string | null
      phone: string | null
      courseTitle: string
    }>()

    orders.forEach((order) => {
      const key = `${order.userId}-${order.courseId}`
      if (!buyersMap.has(key)) {
        buyersMap.set(key, {
          id: key,
          name: order.user.name,
          email: order.user.email,
          phone: order.user.phone,
          courseTitle: order.course.title,
        })
      }
    })

    return NextResponse.json({ buyers: Array.from(buyersMap.values()) })
  } catch (error) {
    console.error('Get buyers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch buyers' },
      { status: 500 }
    )
  }
}
