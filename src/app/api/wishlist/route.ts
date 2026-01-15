import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const user = await requireAuth()

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            category: true,
            _count: {
              select: { reviews: { where: { isApproved: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const coursesWithRating = await Promise.all(
      wishlist.map(async (w) => {
        const avgRating = await prisma.review.aggregate({
          where: { courseId: w.course.id, isApproved: true },
          _avg: { rating: true },
        })
        return {
          ...w,
          course: {
            ...w.course,
            averageRating: avgRating._avg.rating || 0,
          },
        }
      })
    )

    return NextResponse.json({ wishlist: coursesWithRating })
  } catch (error) {
    console.error('Get wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { courseId } = await request.json()

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'კურსი უკვე დამატებულია სურვილებში' },
        { status: 400 }
      )
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: user.id,
        courseId,
      },
    })

    return NextResponse.json({ wishlist: wishlistItem })
  } catch (error) {
    console.error('Add to wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAuth()
    const { courseId } = await request.json()

    await prisma.wishlist.delete({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Remove from wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}
