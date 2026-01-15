import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { courseSchema } from '@/lib/validations'
import { generateSlug } from '@/lib/utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    const where: Record<string, unknown> = {
      isPublished: true,
    }

    if (category) {
      where.category = { slug: category }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { instructor: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: { reviews: { where: { isApproved: true } }, orders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    })

    const coursesWithRating = await Promise.all(
      courses.map(async (course) => {
        const avgRating = await prisma.review.aggregate({
          where: { courseId: course.id, isApproved: true },
          _avg: { rating: true },
        })
        return {
          ...course,
          averageRating: avgRating._avg.rating || 0,
        }
      })
    )

    return NextResponse.json({ courses: coursesWithRating })
  } catch (error) {
    console.error('Get courses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = courseSchema.parse(body)

    const slug = generateSlug(validatedData.title)

    const existingCourse = await prisma.course.findUnique({ where: { slug } })
    if (existingCourse) {
      return NextResponse.json(
        { error: 'კურსი ამ სახელით უკვე არსებობს' },
        { status: 400 }
      )
    }

    const course = await prisma.course.create({
      data: {
        title: validatedData.title,
        slug,
        description: validatedData.description,
        shortDesc: validatedData.shortDesc,
        price: validatedData.price,
        instructor: validatedData.instructor,
        instructorBio: validatedData.instructorBio,
        duration: validatedData.duration,
        startDate: new Date(validatedData.startDate),
        syllabus: validatedData.syllabus,
        syllabusFile: validatedData.syllabusFile || null,
        maxStudents: validatedData.maxStudents,
        isPublished: validatedData.isPublished || false,
        isFeatured: validatedData.isFeatured || false,
        categoryId: validatedData.categoryId,
      },
      include: { category: true },
    })

    return NextResponse.json({ course })
  } catch (error) {
    console.error('Create course error:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}
