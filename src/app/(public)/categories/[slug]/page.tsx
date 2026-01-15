import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CategoryCoursesClient } from './CategoryCoursesClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  })

  if (!category) {
    return { title: 'კატეგორია ვერ მოიძებნა' }
  }

  return {
    title: `${category.name} - კურსები`,
    description: category.description || `${category.name} კატეგორიის კურსები`,
  }
}

async function getCategoryWithCourses(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      courses: {
        where: { isPublished: true },
        include: {
          category: true,
          _count: { select: { reviews: { where: { isApproved: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!category) return null

  const coursesWithRating = await Promise.all(
    category.courses.map(async (course) => {
      const avgRating = await prisma.review.aggregate({
        where: { courseId: course.id, isApproved: true },
        _avg: { rating: true },
      })
      return {
        ...course,
        price: course.price.toNumber(),
        averageRating: avgRating._avg.rating || 0,
      }
    })
  )

  return {
    ...category,
    courses: coursesWithRating,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await getCategoryWithCourses(slug)

  if (!category) {
    notFound()
  }

  return <CategoryCoursesClient category={category} />
}
