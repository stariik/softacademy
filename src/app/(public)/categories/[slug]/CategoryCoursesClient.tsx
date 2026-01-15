'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CourseGrid } from '@/components/courses/CourseGrid'
import { useAuth } from '@/context/AuthContext'
import { ArrowLeft } from 'lucide-react'

interface Course {
  id: string
  slug: string
  title: string
  shortDesc: string
  price: number
  image: string | null
  instructor: string
  duration: string
  startDate: Date
  category: { name: string; slug: string }
  _count: { reviews: number }
  averageRating: number
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  courses: Course[]
}

interface Props {
  category: Category
}

export function CategoryCoursesClient({ category }: Props) {
  const { user } = useAuth()
  const [wishlistIds, setWishlistIds] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      fetchWishlist()
    }
  }, [user])

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist')
      const data = await res.json()
      setWishlistIds((data.wishlist || []).map((w: { courseId: string }) => w.courseId))
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    }
  }

  const handleWishlistToggle = (courseId: string) => {
    setWishlistIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-primary-600 text-white py-12">
        <div className="container-custom">
          <Link
            href="/courses"
            className="flex items-center gap-2 text-primary-200 hover:text-white mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            ყველა კურსი
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">{category.name}</h1>
          {category.description && (
            <p className="text-primary-100">{category.description}</p>
          )}
          <p className="text-primary-200 mt-2">{category.courses.length} კურსი</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <CourseGrid
          courses={category.courses}
          wishlistIds={wishlistIds}
          onWishlistToggle={handleWishlistToggle}
        />
      </div>
    </div>
  )
}
