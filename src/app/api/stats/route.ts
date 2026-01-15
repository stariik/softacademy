export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalCourses,
      totalUsers,
      totalInstructors,
      completedOrders,
    ] = await Promise.all([
      prisma.course.count({ where: { isPublished: true } }),
      prisma.user.count(),
      prisma.course.findMany({
        where: { isPublished: true },
        select: { instructor: true },
        distinct: ['instructor'],
      }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
    ])

    return NextResponse.json({
      courses: totalCourses,
      students: totalUsers,
      instructors: totalInstructors.length,
      certificates: completedOrders,
    })
  } catch (error) {
    console.error('Stats fetch error:', error)
    return NextResponse.json({
      courses: 0,
      students: 0,
      instructors: 0,
      certificates: 0,
    })
  }
}
