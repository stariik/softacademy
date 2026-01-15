import { CourseCard } from './CourseCard'
import { Search } from 'lucide-react'

interface Course {
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

interface CourseGridProps {
  courses: Course[]
  wishlistIds?: string[]
  onWishlistToggle?: (courseId: string) => void
  columns?: 2 | 3 | 4
  emptyMessage?: string
}

export function CourseGrid({
  courses,
  wishlistIds = [],
  onWishlistToggle,
  columns = 3,
  emptyMessage = 'კურსები ვერ მოიძებნა'
}: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6">
          <Search className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">{emptyMessage}</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          სცადეთ სხვა საძიებო სიტყვები ან გაფილტვრის პარამეტრები
        </p>
      </div>
    )
  }

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          isInWishlist={wishlistIds.includes(course.id)}
          onWishlistToggle={onWishlistToggle}
        />
      ))}
    </div>
  )
}
