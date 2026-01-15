'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Card, CardContent } from '@/components/ui/Card'
import { StarRating } from '@/components/reviews/StarRating'
import { ReviewList } from '@/components/reviews/ReviewList'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { CourseCard } from '@/components/courses/CourseCard'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { formatPrice, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  Calendar,
  Clock,
  Users,
  Heart,
  ShoppingCart,
  CheckCircle,
  BookOpen,
  Play,
  Award,
  Globe,
  Star,
  ChevronRight,
  Share2,
  ArrowLeft,
  Video,
  FileText,
  Target,
  Sparkles,
  Download,
} from 'lucide-react'

interface Course {
  id: string
  slug: string
  title: string
  description: string
  shortDesc: string
  price: number
  image: string | null
  instructor: string
  instructorBio: string | null
  instructorImage: string | null
  duration: string
  startDate: Date
  syllabus: unknown
  syllabusFile: string | null
  maxStudents: number | null
  category: { name: string; slug: string }
  reviews: Array<{
    id: string
    rating: number
    comment: string
    createdAt: Date
    user: { name: string }
  }>
  _count: { reviews: number; orders: number }
  averageRating: number
}

interface RelatedCourse {
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

interface Props {
  course: Course
  relatedCourses: RelatedCourse[]
}

const features = [
  { icon: Video, label: 'ლაივ სესია Google Meet-ზე' },
  { icon: FileText, label: 'სასწავლო მასალები' },
  { icon: Award, label: 'სერთიფიკატი' },
  { icon: Globe, label: 'წვდომა ნებისმიერი მოწყობილობიდან' },
]

export function CourseDetailClient({ course, relatedCourses }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState<'description' | 'syllabus' | 'instructor' | 'reviews'>('description')
  const [wishlisted, setWishlisted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAddToWishlist = async () => {
    if (!user) {
      router.push('/login')
      return
    }

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
        addToast('success', wishlisted ? 'კურსი წაიშალა სურვილებიდან' : 'კურსი დაემატა სურვილებში')
      }
    } catch {
      addToast('error', 'შეცდომა')
    } finally {
      setLoading(false)
    }
  }

  const handleBuy = () => {
    if (!user) {
      router.push('/login')
      return
    }
    router.push(`/checkout/${course.slug}`)
  }

  const syllabus = Array.isArray(course.syllabus) ? course.syllabus : []

  const tabs = [
    { id: 'description', label: 'აღწერა', icon: FileText },
    { id: 'syllabus', label: 'სილაბუსი', icon: BookOpen },
    { id: 'instructor', label: 'ლექტორი', icon: Users },
    { id: 'reviews', label: `შეფასებები (${course._count.reviews})`, icon: Star },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative py-8 lg:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/courses" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              კურსები
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <Link
              href={`/categories/${course.category.slug}`}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {course.category.name}
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-white truncate max-w-[200px]">{course.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Info */}
            <div className="order-2 lg:order-1">
              <Badge variant="primary" className="mb-4 bg-primary-500/20 text-primary-300 border-primary-500/30">
                {course.category.name}
              </Badge>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {course.title}
              </h1>

              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                {course.shortDesc}
              </p>

              {/* Rating & Students */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                {course._count.reviews > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-amber-500/20 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-amber-400">{course.averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-slate-400">({course._count.reviews} შეფასება)</span>
                  </div>
                )}
                {course._count.orders > 0 && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users className="w-4 h-4" />
                    <span>{course._count.orders} სტუდენტი</span>
                  </div>
                )}
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <Avatar
                  src={course.instructorImage}
                  fallback={course.instructor}
                  size="lg"
                  className="ring-2 ring-primary-500/30"
                />
                <div>
                  <p className="text-sm text-slate-400">ლექტორი</p>
                  <p className="font-semibold text-white">{course.instructor}</p>
                </div>
              </div>
            </div>

            {/* Right: Image & Price Card */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                {/* Course Image */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800 shadow-2xl">
                  {course.image ? (
                    <Image src={course.image} alt={course.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-600 to-blue-600">
                      <BookOpen className="w-24 h-24 text-white/30" />
                    </div>
                  )}
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                      <Play className="w-8 h-8 text-primary-600 ml-1" />
                    </div>
                  </div>
                </div>

                {/* Price Card - Mobile */}
                <div className="lg:hidden mt-6">
                  <MobilePriceCard
                    course={course}
                    wishlisted={wishlisted}
                    loading={loading}
                    onBuy={handleBuy}
                    onWishlist={handleAddToWishlist}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Course Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-slate-700">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b border-slate-100 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all relative",
                      activeTab === tab.id
                        ? "text-primary-600 bg-primary-50/50"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 md:p-8">
                {activeTab === 'description' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary-500" />
                        კურსის აღწერა
                      </h3>
                      <div className="prose prose-slate max-w-none">
                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{course.description}</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        რას ისწავლით
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {syllabus.slice(0, 6).map((topic, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-600">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'syllabus' && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary-500" />
                      კურსის სილაბუსი
                    </h3>
                    <div className="space-y-4">
                      {syllabus.map((topic, index) => (
                        <div
                          key={index}
                          className="group flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-primary-50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                            <span className="text-sm font-bold text-primary-600 group-hover:text-white">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <div className="flex-1 pt-2">
                            <p className="font-medium text-slate-700 group-hover:text-primary-700">{topic}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {course.syllabusFile && (
                      <div className="mt-8 p-6 bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl border border-primary-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center">
                              <FileText className="w-7 h-7 text-primary-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800">დეტალური სილაბუსი</h4>
                              <p className="text-sm text-slate-500">ჩამოტვირთეთ PDF ფორმატში</p>
                            </div>
                          </div>
                          <a
                            href={course.syllabusFile}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "inline-flex items-center gap-2 px-5 py-3 rounded-xl",
                              "bg-gradient-to-r from-primary-600 to-blue-600",
                              "text-white font-medium",
                              "hover:shadow-lg hover:shadow-primary-500/30",
                              "transition-all duration-300"
                            )}
                          >
                            <Download className="w-5 h-5" />
                            ჩამოტვირთვა
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'instructor' && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary-500" />
                      ლექტორის შესახებ
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
                          {course.instructorImage ? (
                            <Image
                              src={course.instructorImage}
                              alt={course.instructor}
                              width={128}
                              height={128}
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-4xl font-bold text-white">{course.instructor.charAt(0)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold text-slate-800 mb-2">{course.instructor}</h4>
                        <Badge variant="primary" size="sm" className="mb-4">ლექტორი</Badge>
                        <p className="text-slate-600 leading-relaxed">
                          {course.instructorBio || 'ინფორმაცია მალე დაემატება.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-8">
                    {/* Review Summary */}
                    {course._count.reviews > 0 && (
                      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl">
                        <div className="text-center">
                          <p className="text-5xl font-bold text-primary-600">{course.averageRating.toFixed(1)}</p>
                          <StarRating rating={Math.round(course.averageRating)} size="sm" />
                          <p className="text-sm text-slate-500 mt-2">{course._count.reviews} შეფასება</p>
                        </div>
                      </div>
                    )}

                    {/* Review Form */}
                    {user && (
                      <div className="p-6 bg-slate-50 rounded-xl">
                        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                          <Star className="w-5 h-5 text-amber-500" />
                          დაწერე შეფასება
                        </h4>
                        <ReviewForm courseId={course.id} />
                      </div>
                    )}

                    {/* Reviews List */}
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-4">მომხმარებელთა შეფასებები</h4>
                      <ReviewList reviews={course.reviews} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Sidebar - Desktop Only */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <DesktopPriceCard
                course={course}
                wishlisted={wishlisted}
                loading={loading}
                onBuy={handleBuy}
                onWishlist={handleAddToWishlist}
              />
            </div>
          </div>
        </div>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800">მსგავსი კურსები</h2>
              <Link
                href={`/categories/${course.category.slug}`}
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                ყველა <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCourses.map((relatedCourse) => (
                <CourseCard key={relatedCourse.id} course={relatedCourse} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Mobile Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
              {formatPrice(course.price)}
            </p>
          </div>
          <Button onClick={handleBuy} className="flex-1" size="lg">
            <ShoppingCart className="w-5 h-5 mr-2" />
            შეძენა
          </Button>
        </div>
      </div>

      {/* Spacer for fixed bottom bar on mobile */}
      <div className="lg:hidden h-24" />
    </div>
  )
}

// Desktop Price Card Component
function DesktopPriceCard({
  course,
  wishlisted,
  loading,
  onBuy,
  onWishlist,
}: {
  course: Course
  wishlisted: boolean
  loading: boolean
  onBuy: () => void
  onWishlist: () => void
}) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 p-6 text-center">
        <p className="text-sm text-primary-100 mb-1">კურსის ფასი</p>
        <p className="text-4xl font-bold text-white">{formatPrice(course.price)}</p>
      </div>
      <CardContent className="p-6 space-y-6">
        {/* Course Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">დაწყების თარიღი</p>
              <p className="font-medium">{formatDate(course.startDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">ხანგრძლივობა</p>
              <p className="font-medium">{course.duration}</p>
            </div>
          </div>
          {course.maxStudents && (
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">მაქს. სტუდენტი</p>
                <p className="font-medium">{course.maxStudents} სტუდენტი</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Video className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">ფორმატი</p>
              <p className="font-medium">ლაივ Google Meet-ზე</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <Button onClick={onBuy} fullWidth size="lg" variant="gradient">
            <ShoppingCart className="w-5 h-5 mr-2" />
            შეძენა
          </Button>
          <Button
            onClick={onWishlist}
            variant="outline"
            fullWidth
            isLoading={loading}
          >
            <Heart className={cn('w-5 h-5 mr-2', wishlisted && 'fill-red-500 text-red-500')} />
            {wishlisted ? 'სურვილებიდან წაშლა' : 'სურვილებში დამატება'}
          </Button>
        </div>

        {/* Share Button */}
        <button className="w-full flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-primary-600 transition-colors">
          <Share2 className="w-4 h-4" />
          <span className="text-sm">გაზიარება</span>
        </button>
      </CardContent>
    </Card>
  )
}

// Mobile Price Card Component
function MobilePriceCard({
  course,
  wishlisted,
  loading,
  onBuy,
  onWishlist,
}: {
  course: Course
  wishlisted: boolean
  loading: boolean
  onBuy: () => void
  onWishlist: () => void
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-slate-500">კურსის ფასი</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
              {formatPrice(course.price)}
            </p>
          </div>
          <button
            onClick={onWishlist}
            disabled={loading}
            className="p-3 rounded-xl bg-slate-100 hover:bg-red-50 transition-colors"
          >
            <Heart className={cn('w-6 h-6', wishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400')} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-slate-50 rounded-xl">
            <Calendar className="w-5 h-5 text-primary-500 mb-1" />
            <p className="text-xs text-slate-400">დაწყება</p>
            <p className="text-sm font-medium text-slate-700">{formatDate(course.startDate)}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <Clock className="w-5 h-5 text-primary-500 mb-1" />
            <p className="text-xs text-slate-400">ხანგრძლივობა</p>
            <p className="text-sm font-medium text-slate-700">{course.duration}</p>
          </div>
        </div>

        <Button onClick={onBuy} fullWidth size="lg" variant="gradient">
          <ShoppingCart className="w-5 h-5 mr-2" />
          შეძენა
        </Button>
      </CardContent>
    </Card>
  )
}
