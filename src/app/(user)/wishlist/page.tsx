'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CourseGrid } from '@/components/courses/CourseGrid'
import { Card, CardContent } from '@/components/ui/Card'
import { PageSpinner } from '@/components/ui/Spinner'
import { Heart } from 'lucide-react'

interface WishlistItem {
  id: string
  courseId: string
  course: {
    id: string
    slug: string
    title: string
    shortDesc: string
    price: string
    image: string | null
    instructor: string
    duration: string
    startDate: string
    category: { name: string; slug: string }
    _count: { reviews: number }
    averageRating: number
  }
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist')
      const data = await res.json()
      setWishlist(data.wishlist || [])
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWishlistToggle = (courseId: string) => {
    setWishlist((prev) => prev.filter((item) => item.courseId !== courseId))
  }

  if (loading) {
    return <PageSpinner />
  }

  const courses = wishlist.map((item) => ({
    ...item.course,
    price: parseFloat(item.course.price),
  }))

  const wishlistIds = wishlist.map((item) => item.courseId)

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">სურვილების სია</h1>

      {wishlist.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">
              სურვილების სია ცარიელია
            </h3>
            <p className="text-slate-500 mb-4">
              დაამატეთ საინტერესო კურსები სურვილებში
            </p>
            <Link href="/courses" className="text-primary-600 hover:text-primary-700 font-medium">
              კურსების ნახვა
            </Link>
          </CardContent>
        </Card>
      ) : (
        <CourseGrid
          courses={courses}
          wishlistIds={wishlistIds}
          onWishlistToggle={handleWishlistToggle}
        />
      )}
    </div>
  )
}
