'use client'

import { useState, useEffect, useCallback } from 'react'
import { CourseGrid } from '@/components/courses/CourseGrid'
import { CourseSearch } from '@/components/courses/CourseSearch'
import { CategoryFilter } from '@/components/courses/CategoryFilter'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/context/AuthContext'
import { BookOpen, GraduationCap, Users, Award, SlidersHorizontal, LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Course {
  id: string
  slug: string
  title: string
  shortDesc: string
  price: number
  image: string | null
  instructor: string
  duration: string
  startDate: string
  category: { name: string; slug: string }
  _count: { reviews: number }
  averageRating: number
}

interface Category {
  id: string
  name: string
  slug: string
  _count: { courses: number }
}

interface Stats {
  courses: number
  students: number
  instructors: number
  certificates: number
}

export default function CoursesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest')
  const [stats, setStats] = useState<Stats>({ courses: 0, students: 0, instructors: 0, certificates: 0 })

  useEffect(() => {
    fetchCategories()
    fetchCourses()
    fetchStats()
    if (user) {
      fetchWishlist()
    }
  }, [user])

  useEffect(() => {
    fetchCourses()
  }, [selectedCategory, searchQuery, sortBy])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.set('category', selectedCategory)
      if (searchQuery) params.set('search', searchQuery)
      params.set('sort', sortBy)

      const res = await fetch(`/api/courses?${params}`)
      const data = await res.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const statsDisplay = [
    { icon: BookOpen, label: 'კურსი', value: stats.courses > 0 ? `${stats.courses}+` : '0' },
    { icon: Users, label: 'სტუდენტი', value: stats.students > 0 ? `${stats.students}+` : '0' },
    { icon: GraduationCap, label: 'ლექტორი', value: stats.instructors > 0 ? `${stats.instructors}+` : '0' },
    { icon: Award, label: 'სერთიფიკატი', value: stats.certificates > 0 ? `${stats.certificates}` : '0' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

        <div className="container-custom relative py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary-300 text-sm mb-6">
              <GraduationCap className="w-4 h-4" />
              <span>აღმოაჩინე შენთვის საუკეთესო კურსები</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              ისწავლე ახალი{' '}
              <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
                უნარები
              </span>
            </h1>

            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
              გამოიკვლიე ჩვენი მრავალფეროვანი კურსები და დაიწყე შენი კარიერული ზრდა დღესვე
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <CourseSearch
                onSearch={handleSearch}
                placeholder="მოძებნე კურსი..."
                className="w-full"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
            {statsDisplay.map((stat, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/20 text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F8FAFC"/>
          </svg>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="container-custom py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>

            {/* View & Sort Controls */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-600 focus:outline-none focus:border-primary-500 cursor-pointer"
                >
                  <option value="newest">უახლესი</option>
                  <option value="price-low">ფასი: დაბალიდან</option>
                  <option value="price-high">ფასი: მაღლიდან</option>
                  <option value="popular">პოპულარული</option>
                </select>
                <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    viewMode === 'grid'
                      ? "bg-primary-100 text-primary-600"
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    viewMode === 'list'
                      ? "bg-primary-100 text-primary-600"
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-600">
              ნაპოვნია{' '}
              <span className="font-semibold text-slate-800">{courses.length}</span>{' '}
              კურსი
              {selectedCategory && (
                <span className="text-slate-500">
                  {' '}კატეგორიაში: <span className="text-primary-600">{categories.find(c => c.slug === selectedCategory)?.name}</span>
                </span>
              )}
            </p>
          </div>
        )}

        {/* Course Grid */}
        {loading ? (
          <PageSpinner />
        ) : (
          <CourseGrid
            courses={courses}
            wishlistIds={wishlistIds}
            onWishlistToggle={handleWishlistToggle}
            columns={viewMode === 'grid' ? 3 : 2}
          />
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-blue-600 py-16">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            ვერ იპოვე შენთვის სასურველი კურსი?
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            მოგვწერე და დაგეხმარებით შენთვის იდეალური კურსის მოძებნაში
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-lg shadow-primary-900/20"
          >
            დაგვიკავშირდი
          </a>
        </div>
      </section>
    </div>
  )
}
