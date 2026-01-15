'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Clock, Star, Users, Sparkles } from 'lucide-react'
import { formatPrice, formatDateShort } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CourseCardProps {
  course: {
    id: string
    slug: string
    title: string
    shortDesc: string
    price: number | string
    image: string | null
    instructor: string
    duration: string
    startDate: Date | string
    category?: {
      name: string
      slug: string
    }
    _count?: {
      reviews: number
    }
    averageRating?: number
  }
  isInWishlist?: boolean
  onWishlistToggle?: (courseId: string) => void
  variant?: 'default' | 'featured' | 'compact'
}

export function CourseCard({
  course,
  isInWishlist = false,
  onWishlistToggle,
  variant = 'default'
}: CourseCardProps) {
  const { user } = useAuth()
  const [wishlisted, setWishlisted] = useState(isInWishlist)
  const [loading, setLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) return

    setLoading(true)
    try {
      const method = wishlisted ? 'DELETE' : 'POST'
      const res = await fetch('/api/wishlist', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id }),
      })

      if (res.ok) {
        setWishlisted(!wishlisted)
        onWishlistToggle?.(course.id)
      }
    } catch (error) {
      console.error('Wishlist error:', error)
    } finally {
      setLoading(false)
    }
  }

  const price = typeof course.price === 'string' ? parseFloat(course.price) : course.price

  if (variant === 'compact') {
    return (
      <Link href={`/courses/${course.slug}`}>
        <div className="group flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-500">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary-500 to-blue-600">
            {course.image ? (
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white/80" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors line-clamp-1">
              {course.title}
            </h4>
            <p className="text-sm text-slate-500 mt-0.5">{course.instructor}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-primary-600 font-bold">{formatPrice(price)}</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {course.duration}
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/courses/${course.slug}`}>
      <div
        className={cn(
          "group relative h-full",
          variant === 'featured' && "lg:flex"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated gradient border */}
        <div className={cn(
          "absolute -inset-0.5 bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500 rounded-[28px] opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500",
          isHovered && "animate-pulse"
        )} />

        {/* Card Container */}
        <div className={cn(
          "relative h-full bg-white rounded-3xl overflow-hidden",
          "border border-slate-200/80",
          "shadow-lg shadow-slate-200/50 group-hover:shadow-2xl group-hover:shadow-primary-500/20",
          "transition-all duration-500",
          "transform group-hover:-translate-y-1",
          variant === 'featured' && "lg:flex"
        )}>
          {/* Image Container */}
          <div className={cn(
            "relative overflow-hidden",
            variant === 'featured' ? "lg:w-1/2 h-64 lg:h-full" : "aspect-[16/11]"
          )}>
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-blue-600 to-indigo-700">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-4 right-4 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl" />
              </div>
            </div>

            {course.image ? (
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -inset-3 border border-white/10 rounded-3xl" />
                </div>
              </div>
            )}

            {/* Top Overlay */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />

            {/* Bottom Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Wishlist Button */}
            {user && (
              <button
                onClick={handleWishlist}
                disabled={loading}
                className={cn(
                  "absolute top-4 right-4 p-2.5 rounded-xl",
                  "bg-white/20 backdrop-blur-md border border-white/30",
                  "hover:bg-white/40 hover:scale-105 active:scale-95",
                  "transition-all duration-300",
                  wishlisted && "bg-red-500/80 border-red-400/50",
                  loading && "opacity-50"
                )}
              >
                <Heart
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    wishlisted ? 'fill-white text-white' : 'text-white'
                  )}
                />
              </button>
            )}

            {/* Category Badge */}
            {course.category && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white text-sm font-medium border border-white/20">
                  {course.category.name}
                </span>
              </div>
            )}

            {/* Duration Badge - Bottom */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white text-sm font-medium">
                <Clock className="w-4 h-4" />
                {course.duration}
              </span>
            </div>

            {/* Start Date Badge */}
            <div className="absolute bottom-4 right-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg text-slate-700 text-sm font-medium shadow-lg">
                {formatDateShort(course.startDate)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className={cn(
            "p-6 flex flex-col",
            variant === 'featured' ? "lg:w-1/2 lg:p-8 justify-center" : "flex-1"
          )}>
            {/* Rating Row */}
            <div className="flex items-center justify-between mb-4">
              {course._count?.reviews !== undefined && course._count.reviews > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 rounded-lg">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-amber-600 text-sm">
                      {course.averageRating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <span className="text-slate-400 text-sm">
                    ({course._count.reviews})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-lg">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 text-sm font-medium">ახალი</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                <Users className="w-4 h-4" />
                <span>12+</span>
              </div>
            </div>

            {/* Title */}
            <h3 className={cn(
              "font-bold text-slate-800 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight",
              variant === 'featured' ? "text-2xl lg:text-3xl mb-4" : "text-lg mb-3"
            )}>
              {course.title}
            </h3>

            {/* Description */}
            <p className={cn(
              "text-slate-500 line-clamp-2 leading-relaxed",
              variant === 'featured' ? "text-base mb-6" : "text-sm mb-4"
            )}>
              {course.shortDesc}
            </p>

            {/* Divider */}
            <div className="mt-auto pt-4 border-t border-slate-100">
              {/* Footer */}
              <div className="flex items-center justify-between">
                {/* Instructor */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/30">
                      {course.instructor.charAt(0)}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{course.instructor}</p>
                    <p className="text-xs text-slate-400">ლექტორი</p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <div className="relative">
                    <span className="text-2xl font-black bg-gradient-to-r from-primary-600 via-blue-600 to-primary-600 bg-clip-text text-transparent">
                      {formatPrice(price)}
                    </span>
                    <div className={cn(
                      "absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full transform origin-left transition-transform duration-500",
                      isHovered ? "scale-x-100" : "scale-x-0"
                    )} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Featured Course Card for homepage
export function FeaturedCourseCard({ course }: { course: CourseCardProps['course'] }) {
  return <CourseCard course={course} variant="featured" />
}

// Compact Course Card for sidebars
export function CompactCourseCard({ course }: { course: CourseCardProps['course'] }) {
  return <CourseCard course={course} variant="compact" />
}
