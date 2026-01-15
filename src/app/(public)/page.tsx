import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CourseGrid } from '@/components/courses/CourseGrid'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import {
  GraduationCap,
  Users,
  Award,
  ArrowRight,
  CheckCircle,
  Play,
  Star,
  Sparkles,
  Video,
  MessageSquare,
  Target,
  Zap,
  BookOpen,
  Code,
} from 'lucide-react'

async function getFeaturedCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true, isFeatured: true },
      include: {
        category: true,
        _count: { select: { reviews: { where: { isApproved: true } } } },
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
    })

    const coursesWithRating = await Promise.all(
      courses.map(async (course) => {
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

    return coursesWithRating
  } catch {
    return []
  }
}


async function getStats() {
  try {
    const [courseCount, userCount] = await Promise.all([
      prisma.course.count({ where: { isPublished: true } }),
      prisma.user.count(),
    ])
    return { courses: courseCount, users: userCount }
  } catch {
    return { courses: 50, users: 1000 }
  }
}

export default async function HomePage() {
  const [featuredCourses, stats] = await Promise.all([
    getFeaturedCourses(),
    getStats(),
  ])

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Gradient orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400/15 rounded-full blur-3xl animate-pulse-soft animation-delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="container-custom relative py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6',
                'bg-white/10 backdrop-blur-sm border border-white/20',
                'text-primary-200 text-sm font-medium',
                'animate-fade-in'
              )}>
                <Sparkles className="w-4 h-4" />
                <span>ონლაინ სასწავლო პლატფორმა</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
                განავითარე
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">
                  შენი კარიერა
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0 animate-slide-up animation-delay-200">
                შეიძინე საუკეთესო კურსები და ისწავლე ლაივ სესიებზე საქართველოს
                წამყვან პროფესიონალებთან. Google Meet-ის საშუალებით.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 animate-slide-up animation-delay-300">
                <Link href="/courses">
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-primary-50 shadow-xl shadow-white/10">
                    კურსების ნახვა
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    დაწყება უფასოა
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mt-10 pt-10 border-t border-white/10 animate-fade-in animation-delay-500">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-slate-900" />
                    ))}
                  </div>
                  <span className="text-slate-300 text-sm">
                    <strong className="text-white">{stats.users}+</strong> სტუდენტი
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-300 text-sm">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <strong className="text-white">4.9</strong>
                  <span>/5 შეფასება</span>
                </div>
              </div>
            </div>

            {/* Right Content - Decorative Cards */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[500px]">
                {/* Floating course cards */}
                <div className="absolute top-0 right-0 w-72 animate-float">
                  <Card variant="glass" className="bg-white/10 backdrop-blur-xl border-white/20">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                          <Code className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">React კურსი</p>
                          <p className="text-xs text-slate-300">12 სტუდენტი</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="success" size="sm">ლაივ</Badge>
                        <span className="text-white font-bold">200 GEL</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="absolute bottom-20 left-0 w-64 animate-float animation-delay-1000">
                  <Card variant="glass" className="bg-white/10 backdrop-blur-xl border-white/20">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">კურსი დასრულებულია!</p>
                          <p className="text-xs text-slate-300">სერტიფიკატი მზადაა</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="absolute top-1/2 right-20 transform -translate-y-1/2 w-56 animate-float animation-delay-500">
                  <Card variant="glass" className="bg-white/10 backdrop-blur-xl border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="w-5 h-5 text-red-400" />
                        <span className="text-white font-medium text-sm">ლაივ სესია</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-slate-600 border border-slate-700" />
                          ))}
                        </div>
                        <span className="text-slate-300 text-xs">+8 ონლაინ</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,50 C360,150 1080,-50 1440,50 L1440,100 L0,100 Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-6 bg-white relative -mt-px">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: `${stats.courses}+`, label: 'კურსი', icon: BookOpen },
              { value: `${stats.users}+`, label: 'სტუდენტი', icon: Users },
              { value: '20+', label: 'ლექტორი', icon: Award },
              { value: '98%', label: 'კმაყოფილება', icon: Star },
            ].map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  'text-center p-6 rounded-2xl',
                  'bg-gradient-to-br from-slate-50 to-white',
                  'border border-slate-100',
                  'hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-1',
                  'transition-all duration-300'
                )}
              >
                <stat.icon className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="container-custom relative">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
              <div>
                <Badge variant="primary" className="mb-4">პოპულარული</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  გამორჩეული კურსები
                </h2>
                <p className="text-slate-500 text-lg">
                  ყველაზე პოპულარული კურსები ჩვენს პლატფორმაზე
                </p>
              </div>
              <Link href="/courses">
                <Button variant="outline" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  ყველა კურსი
                </Button>
              </Link>
            </div>
            <CourseGrid courses={featuredCourses} columns={3} />
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="primary" className="mb-4">უპირატესობები</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                რატომ SoftAcademy?
              </h2>
              <p className="text-slate-500 text-lg mb-8">
                ჩვენ გთავაზობთ უნიკალურ სწავლის გამოცდილებას, რომელიც გაგზრდით
                პროფესიონალურ უნარებს რეალურ დროში.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: Video,
                    title: 'ლაივ სესიები',
                    description: 'ყველა კურსი ტარდება ლაივ რეჟიმში Google Meet-ზე, რეალურ დროში კითხვა-პასუხის შესაძლებლობით.',
                  },
                  {
                    icon: Award,
                    title: 'საუკეთესო ლექტორები',
                    description: 'კურსებს უძღვებიან სფეროს წამყვანი პროფესიონალები მრავალწლიანი გამოცდილებით.',
                  },
                  {
                    icon: MessageSquare,
                    title: 'მხარდაჭერა',
                    description: 'მიიღე პასუხები შენს კითხვებზე პირდაპირ ლექტორისგან სესიის დროს.',
                  },
                  {
                    icon: Target,
                    title: 'პრაქტიკული ცოდნა',
                    description: 'კურსები ორიენტირებულია პრაქტიკულ უნარებზე, რომლებსაც დაუყოვნებლივ გამოიყენებ.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 group">
                    <div className={cn(
                      'w-12 h-12 rounded-xl shrink-0',
                      'bg-gradient-to-br from-primary-500 to-primary-600',
                      'flex items-center justify-center',
                      'shadow-lg shadow-primary-500/30',
                      'group-hover:scale-110 transition-transform duration-300'
                    )}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-slate-500 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className={cn(
                'aspect-square rounded-3xl overflow-hidden',
                'bg-gradient-to-br from-primary-100 to-primary-200',
                'shadow-2xl shadow-primary-500/20'
              )}>
                {/* Placeholder for image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <GraduationCap className="w-24 h-24 text-primary-400 mx-auto mb-4" />
                    <p className="text-primary-600 font-medium">SoftAcademy</p>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-2xl bg-white shadow-xl p-4 animate-float">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-slate-900">4.9</span>
                </div>
                <p className="text-xs text-slate-500">საშუალო შეფასება</p>
              </div>

              <div className="absolute -bottom-6 -left-6 w-40 h-24 rounded-2xl bg-white shadow-xl p-4 animate-float animation-delay-500">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span className="font-semibold text-slate-900">სწრაფი</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">რეგისტრაცია 2 წუთში</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800" />

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="container-custom relative text-center">
          <div className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6',
            'bg-white/10 backdrop-blur-sm border border-white/20',
            'text-white/90 text-sm font-medium'
          )}>
            <Sparkles className="w-4 h-4" />
            <span>დაიწყე სწავლა დღესვე</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">
            მზად ხარ კარიერული
            <span className="text-primary-200"> გარდატეხისთვის?</span>
          </h2>

          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            შემოგვიერთდი ათასობით სტუდენტს და დაიწყე სწავლა საუკეთესო ლექტორებთან.
            რეგისტრაცია უფასოა.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button
                size="xl"
                className="bg-white text-primary-700 hover:bg-primary-50 shadow-xl shadow-black/20"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                უფასო რეგისტრაცია
              </Button>
            </Link>
            <Link href="/courses">
              <Button
                size="xl"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                კურსების ნახვა
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
