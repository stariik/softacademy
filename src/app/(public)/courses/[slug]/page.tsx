import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CourseDetailClient } from './CourseDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { title: true, shortDesc: true },
  })

  if (!course) {
    return { title: 'კურსი ვერ მოიძებნა' }
  }

  return {
    title: course.title,
    description: course.shortDesc,
  }
}

async function getCourse(slug: string) {
  const course = await prisma.course.findUnique({
    where: { slug, isPublished: true },
    include: {
      category: true,
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { reviews: { where: { isApproved: true } }, orders: true },
      },
    },
  })

  if (!course) return null

  const avgRating = await prisma.review.aggregate({
    where: { courseId: course.id, isApproved: true },
    _avg: { rating: true },
  })

  return {
    ...course,
    price: course.price.toNumber(),
    averageRating: avgRating._avg.rating || 0,
  }
}

async function getRelatedCourses(categoryId: string, excludeId: string) {
  const courses = await prisma.course.findMany({
    where: {
      categoryId,
      isPublished: true,
      id: { not: excludeId },
    },
    include: {
      category: true,
      _count: { select: { reviews: { where: { isApproved: true } } } },
    },
    take: 3,
  })

  return courses.map((course) => ({
    ...course,
    price: course.price.toNumber(),
    averageRating: 0,
  }))
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const course = await getCourse(slug)

  if (!course) {
    notFound()
  }

  const relatedCourses = await getRelatedCourses(course.categoryId, course.id)

  return <CourseDetailClient course={course} relatedCourses={relatedCourses} />
}
