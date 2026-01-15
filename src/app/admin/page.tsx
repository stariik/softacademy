import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, formatDateShort } from '@/lib/utils'
import {
  Users,
  BookOpen,
  ShoppingCart,
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Newspaper,
  Tag,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const [
    totalUsers,
    totalCourses,
    totalOrders,
    revenueResult,
    recentOrders,
    pendingReviews,
    totalBlogPosts,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.order.count({ where: { status: 'COMPLETED' } }),
    prisma.order.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { finalAmount: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } },
      },
    }),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.blogPost.count(),
  ])

  return {
    totalUsers,
    totalCourses,
    totalOrders,
    totalRevenue: revenueResult._sum.finalAmount?.toNumber() || 0,
    recentOrders,
    pendingReviews,
    totalBlogPosts,
  }
}

const statsConfig = [
  {
    title: 'მომხმარებლები',
    icon: Users,
    color: 'primary',
    bgGradient: 'from-primary-500 to-blue-600',
    lightBg: 'bg-primary-50',
    textColor: 'text-primary-600',
    change: '+12%',
    changeType: 'up' as const,
  },
  {
    title: 'კურსები',
    icon: BookOpen,
    color: 'emerald',
    bgGradient: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    change: '+5%',
    changeType: 'up' as const,
  },
  {
    title: 'შეკვეთები',
    icon: ShoppingCart,
    color: 'amber',
    bgGradient: 'from-amber-500 to-orange-600',
    lightBg: 'bg-amber-50',
    textColor: 'text-amber-600',
    change: '+23%',
    changeType: 'up' as const,
  },
  {
    title: 'შემოსავალი',
    icon: DollarSign,
    color: 'violet',
    bgGradient: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50',
    textColor: 'text-violet-600',
    change: '+18%',
    changeType: 'up' as const,
  },
]

export default async function AdminDashboard() {
  const stats = await getStats()

  const statsValues = [
    stats.totalUsers,
    stats.totalCourses,
    stats.totalOrders,
    stats.totalRevenue,
  ]

  const statusColors = {
    PENDING: 'warning',
    COMPLETED: 'success',
    CANCELLED: 'error',
    REFUNDED: 'default',
  } as const

  const statusLabels = {
    PENDING: 'მოლოდინში',
    COMPLETED: 'დასრულებული',
    CANCELLED: 'გაუქმებული',
    REFUNDED: 'დაბრუნებული',
  }

  const quickActions = [
    { name: 'ახალი კურსი', href: '/admin/courses/new', icon: BookOpen, color: 'primary' },
    { name: 'ახალი სტატია', href: '/admin/blog/new', icon: Newspaper, color: 'emerald' },
    { name: 'პრომოკოდი', href: '/admin/promocodes', icon: Tag, color: 'amber' },
    { name: 'შეტყობინება', href: '/admin/messages', icon: MessageSquare, color: 'violet' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            გამარჯობა, ადმინ!
          </h1>
          <p className="text-slate-500 mt-1">
            აქ არის თქვენი პლატფორმის მიმოხილვა
          </p>
        </div>
        <div className="flex items-center gap-3">
          {stats.pendingReviews > 0 && (
            <Link href="/admin/reviews">
              <Badge variant="warning" className="py-2 px-4">
                {stats.pendingReviews} მოლოდინში მყოფი შეფასება
              </Badge>
            </Link>
          )}
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            ახალი კურსი
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon
          const value = index === 3 ? formatPrice(statsValues[index]) : statsValues[index]

          return (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-4">
                    {stat.changeType === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={stat.changeType === 'up' ? 'text-emerald-600' : 'text-red-600'}>
                      {stat.change}
                    </span>
                    <span className="text-slate-400 text-sm">vs წინა თვე</span>
                  </div>
                </div>
                <div className={`h-1 ${stat.bgGradient} bg-gradient-to-r`} />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-semibold text-slate-800">ბოლო შეკვეთები</h2>
                <p className="text-sm text-slate-500 mt-0.5">უახლესი ტრანზაქციები</p>
              </div>
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                ყველა
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {stats.recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">ჯერ არ არის შეკვეთები</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">შეკვეთა</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">მომხმარებელი</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">თანხა</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">სტატუსი</th>
                        <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {stats.recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-slate-800">#{order.orderNumber}</p>
                              <p className="text-xs text-slate-400">{formatDateShort(order.createdAt)}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                                {order.user.name.charAt(0)}
                              </div>
                              <span className="text-sm text-slate-600">{order.user.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-semibold text-slate-800">
                              {formatPrice(order.finalAmount.toNumber())}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <Badge variant={statusColors[order.status]} size="sm">
                              {statusLabels[order.status]}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <Card>
            <CardHeader className="border-b border-slate-100 pb-4">
              <h2 className="font-semibold text-slate-800">სწრაფი მოქმედებები</h2>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  const bgColors = {
                    primary: 'bg-primary-50 hover:bg-primary-100 text-primary-600',
                    emerald: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600',
                    amber: 'bg-amber-50 hover:bg-amber-100 text-amber-600',
                    violet: 'bg-violet-50 hover:bg-violet-100 text-violet-600',
                  }

                  return (
                    <Link
                      key={index}
                      href={action.href}
                      className={`p-4 rounded-xl text-center transition-all hover:shadow-md ${bgColors[action.color as keyof typeof bgColors]}`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">{action.name}</span>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Platform Stats */}
          <Card>
            <CardHeader className="border-b border-slate-100 pb-4">
              <h2 className="font-semibold text-slate-800">პლატფორმა</h2>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">კურსები</p>
                    <p className="text-xs text-slate-500">აქტიური</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-slate-800">{stats.totalCourses}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Newspaper className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">ბლოგი</p>
                    <p className="text-xs text-slate-500">სტატიები</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-slate-800">{stats.totalBlogPosts}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">მომხმარებლები</p>
                    <p className="text-xs text-slate-500">რეგისტრირებული</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-slate-800">{stats.totalUsers}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
