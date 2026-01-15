import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { courseSchema } from '@/lib/validations'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { reviews: { where: { isApproved: true } }, orders: true },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'კურსი ვერ მოიძებნა' },
        { status: 404 }
      )
    }

    const avgRating = await prisma.review.aggregate({
      where: { courseId: course.id, isApproved: true },
      _avg: { rating: true },
    })

    return NextResponse.json({
      course: {
        ...course,
        averageRating: avgRating._avg.rating || 0,
      },
    })
  } catch (error) {
    console.error('Get course error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin()
    const { slug } = await params

    const body = await request.json()
    const validatedData = courseSchema.partial().parse(body)

    const course = await prisma.course.findUnique({ where: { slug } })
    if (!course) {
      return NextResponse.json(
        { error: 'კურსი ვერ მოიძებნა' },
        { status: 404 }
      )
    }

    const updatedCourse = await prisma.course.update({
      where: { slug },
      data: {
        ...validatedData,
        startDate: validatedData.startDate
          ? new Date(validatedData.startDate)
          : undefined,
      },
      include: { category: true },
    })

    return NextResponse.json({ course: updatedCourse })
  } catch (error) {
    console.error('Update course error:', error)
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin()
    const { slug } = await params

    await prisma.course.delete({ where: { slug } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete course error:', error)
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}
