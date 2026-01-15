import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireAdmin } from '@/lib/auth'
import { reviewSchema } from '@/lib/validations'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const pending = searchParams.get('pending')

    if (pending === 'true') {
      await requireAdmin()
    }

    const where: Record<string, unknown> = {}

    if (courseId) {
      where.courseId = courseId
      where.isApproved = true
    }

    if (pending === 'true') {
      where.isApproved = false
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { name: true } },
        course: { select: { title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { courseId, ...reviewData } = body
    const validatedData = reviewSchema.parse(reviewData)

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'თქვენ უკვე დაწერეთ შეფასება ამ კურსზე' },
        { status: 400 }
      )
    }

    const hasPurchased = await prisma.order.findFirst({
      where: {
        userId: user.id,
        courseId,
        status: 'COMPLETED',
      },
    })

    if (!hasPurchased) {
      return NextResponse.json(
        { error: 'შეფასების დასაწერად უნდა შეიძინოთ კურსი' },
        { status: 403 }
      )
    }

    const review = await prisma.review.create({
      data: {
        rating: validatedData.rating,
        comment: validatedData.comment,
        userId: user.id,
        courseId,
        isApproved: false,
      },
    })

    return NextResponse.json({ review })
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin()
    const { id, isApproved } = await request.json()

    const review = await prisma.review.update({
      where: { id },
      data: { isApproved },
    })

    return NextResponse.json({ review })
  } catch (error) {
    console.error('Update review error:', error)
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Review ID required' },
        { status: 400 }
      )
    }

    await prisma.review.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete review error:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}
